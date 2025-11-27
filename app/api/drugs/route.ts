import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const drugs = await prisma.drug.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(drugs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch drugs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, quantity, expiryDate, description } = body;

    const drug = await prisma.drug.create({
      data: {
        name,
        category,
        price,
        quantity,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        description,
      },
    });

    return NextResponse.json(drug, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create drug" }, { status: 500 });
  }
}