// controllers/dashboardController.ts

import { Request, Response } from "express";
import { PrismaClient, Product, ProductStockLevel } from "@prisma/client";

const prisma = new PrismaClient();

export const getLowStockProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        minimumStock: {
          not: null,
        },
      },
      include: {
        stockLevels: true, // Include stockLevels in the query
      },
    });

    const lowStockProducts = products.filter((product) => {
      const totalStockQuantity = product.stockLevels.reduce(
        (total, stockLevel) => total + stockLevel.stockQuantity,
        0
      );
      return totalStockQuantity <= (product.minimumStock || 0);
    });

    res.json(lowStockProducts);
  } catch (error) {
    console.error("Error retrieving low stock products:", error);
    res.status(500).json({ message: "Error retrieving low stock products" });
  }
};
