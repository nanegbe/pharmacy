import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, category, price, quantity, expiryDate, description } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Drug id is required" },
        { status: 400 }
      );
    }

    // Check if the drug exists first
    const existing = await prisma.drug.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Drug not found" },
        { status: 404 }
      );
    }

    const drug = await prisma.drug.update({
      where: { id },
      data: {
        name,
        category,
        price,
        quantity,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        description,
      },
    });

    return NextResponse.json(drug);
  } catch (error) {
    console.error("Error updating drug:", error);
    return NextResponse.json(
      { error: "Failed to update drug" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Drug id is required" },
        { status: 400 }
      );
    }

    // Check if the drug exists first
    const existing = await prisma.drug.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Drug not found" },
        { status: 404 }
      );
    }

    await prisma.drug.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting drug:", error);
    return NextResponse.json(
      { error: "Failed to delete drug" },
      { status: 500 }
    );
  }
}