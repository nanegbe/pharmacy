import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get total number of drugs in inventory
    const totalDrugs = await prisma.drug.count();

    // Get today's sales (from midnight to now)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaySales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const salesToday = todaySales.length;
    const revenueToday = todaySales.reduce((sum: number, sale: any) => sum + sale.total, 0);

    return NextResponse.json({
      totalDrugs,
      salesToday,
      revenueToday,
    });
  } catch (error) {
    console.error("Error fetching quick stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch quick stats" },
      { status: 500 }
    );
  }
}
