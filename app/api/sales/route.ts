import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        items: {
          include: {
            drug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Sale items are required" },
        { status: 400 }
      );
    }

    // Validate stock and calculate total
    let total = 0;
    const validatedItems: {
      drugId: string;
      drugName: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const drug = await prisma.drug.findUnique({
        where: { id: item.drugId },
      });

      if (!drug) {
        return NextResponse.json(
          { error: `Drug with id ${item.drugId} not found` },
          { status: 404 }
        );
      }

      if (drug.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${drug.name}. Available: ${drug.quantity}, Requested: ${item.quantity}` },
          { status: 400 }
        );
      }

      const subtotal = drug.price * item.quantity;
      total += subtotal;

      validatedItems.push({
        drugId: drug.id,
        drugName: drug.name,
        quantity: item.quantity,
        price: drug.price,
        subtotal,
      });
    }

    // Create sale with items and update inventory in a transaction
    const sale = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the sale with items
      const newSale = await tx.sale.create({
        data: {
          total,
          items: {
            create: validatedItems,
          },
        },
        include: {
          items: {
            include: {
              drug: true,
            },
          },
        },
      });

      // Update inventory for each item
      for (const item of items) {
        await tx.drug.update({
          where: { id: item.drugId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newSale;
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Failed to create sale" },
      { status: 500 }
    );
  }
}
