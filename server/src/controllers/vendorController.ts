import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Toggle vendor status (active/inactive)
export const toggleVendorStatus = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;

    const vendor = await prisma.vendor.findUnique({ where: { vendorId } });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const updatedVendor = await prisma.vendor.update({
      where: { vendorId },
      data: {
        isActive: !vendor.isActive,
      },
    });

    res.status(200).json(updatedVendor);
  } catch (error) {
    console.error("Error updating vendor status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
