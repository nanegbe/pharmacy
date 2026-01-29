import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "24h";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let fromDate: Date;
    const toDate = new Date();

    // Calculate date range based on period
    if (period === "custom" && startDate && endDate) {
      fromDate = new Date(startDate);
      toDate.setTime(new Date(endDate).getTime());
    } else {
      switch (period) {
        case "24h":
          fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "12m":
          fromDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      }
    }

    // Get sales in the date range
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
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

    // Calculate total revenue
    const totalRevenue = sales.reduce((sum: number, sale: any) => sum + sale.total, 0);

    // Calculate total drugs sold
    const totalDrugsSold = sales.reduce(
      (sum: number, sale: any) => sum + sale.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0),
      0
    );

    // Calculate top selling drugs with proper unit price calculation
    const drugSales = new Map<string, { 
      name: string; 
      quantity: number; 
      revenue: number;
      unitPrice: number;
      totalAmountGenerated: number;
    }>();

    sales.forEach((sale: any) => {
      sale.items.forEach((item: any) => {
        const existing = drugSales.get(item.drugId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.subtotal;
          // Recalculate average unit price
          existing.unitPrice = existing.revenue / existing.quantity;
          existing.totalAmountGenerated = existing.quantity * existing.unitPrice;
        } else {
          const unitPrice = item.price; // Use the price from sale item
          drugSales.set(item.drugId, {
            name: item.drugName,
            quantity: item.quantity,
            revenue: item.subtotal,
            unitPrice: unitPrice,
            totalAmountGenerated: item.quantity * unitPrice,
          });
        }
      });
    });

    const topSellingDrugs = Array.from(drugSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 100); // Show more drugs when "Show All" is clicked

    // Get sales count
    const salesCount = sales.length;

    // Sort all drugs alphabetically for the "Show All" view
    const allDrugsSorted = Array.from(drugSales.values())
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      totalRevenue,
      totalDrugsSold,
      salesCount,
      topSellingDrugs: topSellingDrugs.map(drug => ({
        ...drug,
        unitPrice: parseFloat(drug.unitPrice.toFixed(2)),
        totalAmountGenerated: parseFloat(drug.totalAmountGenerated.toFixed(2))
      })),
      allDrugsSorted: allDrugsSorted.map(drug => ({
        ...drug,
        unitPrice: parseFloat(drug.unitPrice.toFixed(2)),
        totalAmountGenerated: parseFloat(drug.totalAmountGenerated.toFixed(2))
      })),
      period,
      fromDate,
      toDate,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
