// controllers/invoiceController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createInvoice = async (req: Request, res: Response) => {
    try {
        const { items, locationId } = req.body;
        const managerId = req.user?.userId;

        // Ensure all necessary data is present
        if (!items || !locationId || !managerId) {
            return res.status(400).json({ message: "Missing required data for invoice generation" });
        }

        // Create the invoice
        const invoice = await prisma.invoice.create({
            data: {
                locationId,
                managerId,
                status: "PENDING",  // Set initial status
                items: {
                    create: items.map((item: { productId: string; quantity: number; amount: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        amount: item.amount,
                    })),
                },
            },
            include: {
                items: true, // Include items in the response
            },
        });

        res.status(201).json(invoice);
    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).json({ message: "Error creating invoice" });
    }
};

export const getInvoices = async (req: Request, res: Response) => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                items: true,
                manager: { select: { name: true } },
                location: { select: { name: true } },
            },
        });
        res.json(invoices);
    } catch (error) {
        console.error("Error retrieving invoices:", error);
        res.status(500).json({ message: "Error retrieving invoices" });
    }
};
