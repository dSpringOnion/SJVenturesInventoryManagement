// controllers/productController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { name, chineseName, price, minimumStock, vendorId } = req.body;
    const locationId = req.user?.locationId; // Assuming locationId is available

    if (!locationId) {
      return res.status(400).json({ message: "Location ID is required" });
    }

    // Create the Product
    const product = await prisma.product.create({
      data: {
        name,
        chineseName,
        price,
        minimumStock,
        vendorId,
      },
    });

    // Create the initial ProductStockLevel
    await prisma.productStockLevel.create({
      data: {
        productId: product.productId,
        locationId: locationId,
        stockQuantity: 0,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Error creating product" });
  }
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        vendor: true,
        stockLevels: true,
      },
    });

    return res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getLowStockProducts = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const products = await prisma.product.findMany({
      where: {
        minimumStock: {
          not: null,
        },
      },
      include: {
        stockLevels: true,
      },
    });

    const lowStockProducts = products.filter((product) => {
      const totalStockQuantity = product.stockLevels.reduce(
        (total, stockLevel) => total + stockLevel.stockQuantity,
        0
      );
      return totalStockQuantity <= (product.minimumStock || 0);
    });

    return res.json(lowStockProducts);
  } catch (error) {
    console.error("Error retrieving low stock products:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving low stock products" });
  }
};
