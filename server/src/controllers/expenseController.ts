// controllers/expenseController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getExpenseSummary = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { locationId, period } = req.query;

    // Validate period
    const validPeriods = ["week", "month", "quarter"];
    const selectedPeriod = validPeriods.includes(period as string)
      ? (period as string)
      : "month";

    // Calculate date range
    const dateFrom = new Date();
    switch (selectedPeriod) {
      case "week":
        dateFrom.setDate(dateFrom.getDate() - 7);
        break;
      case "month":
        dateFrom.setMonth(dateFrom.getMonth() - 1);
        break;
      case "quarter":
        dateFrom.setMonth(dateFrom.getMonth() - 3);
        break;
    }

    // Ensure locationId is provided
    if (!locationId) {
      return res.status(400).json({ message: "Location ID is required" });
    }

    // Fetch invoice items for the location and period
    const invoiceItems = await prisma.invoiceItem.findMany({
      where: {
        invoice: {
          locationId: locationId as string,
          createdAt: {
            gte: dateFrom,
          },
        },
      },
      include: {
        product: {
          select: {
            price: true,
          },
        },
      },
    });

    // Calculate total expenses
    const totalExpenses = invoiceItems.reduce(
      (acc: number, item) => acc + item.product.price * item.quantity,
      0
    );

    return res.json({
      totalExpenses,
      period: selectedPeriod,
    });
  } catch (error) {
    console.error("Error retrieving expense summary:", error);
    return res.status(500).json({
      message: "Error retrieving expense summary",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
