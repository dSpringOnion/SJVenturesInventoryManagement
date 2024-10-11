// types/express.d.ts

import * as express from "express";

declare global {
  namespace Express {
    // Define the User interface
    interface User {
      userId: string;
      name: string;
      email: string;
      role: "ADMIN" | "MANAGER"; // Adjust roles as per your application
      locationId?: string; // Optional if not all users have a location
      // Add any other properties your User object has
    }

    // Define the Product interface
    interface Product {
      productId: string;
      name: string;
      chineseName?: string;
      price: number;
      minimumStock?: number;
      vendorId?: string;
      stockQuantity: number;
      // Add any other properties your Product object has
    }

    // Extend the Request interface to include user and product
    interface Request {
      user?: User;
      product?: Product;
      // Add any other custom properties here
    }
  }
}
