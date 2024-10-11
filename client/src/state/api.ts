import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Role = "MANAGER" | "AREA_MANAGER" | "ADMIN";

export type InvoiceStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SENT_TO_VENDOR";

export interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  locationId?: string;
  invoices?: Invoice[];
  location?: Location;
}

export interface Vendor {
  vendorId: string;
  name: string;
  isActive: boolean;
  products?: Product[];
}

export interface ProductStockLevel {
  id: string;
  productId: string;
  locationId: string;
  stockQuantity: number;
  product?: Product;
  location?: Location;
}

export interface InvoiceItem {
  invoiceItemId: string;
  invoiceId: string;
  productId: string;
  quantity: number;
  amount: number;
  product?: Product;
}

export interface Invoice {
  invoiceId: string;
  managerId: string;
  locationId: string;
  createdAt: string; // or Date
  status: InvoiceStatus;
  items?: InvoiceItem[];
  manager?: User;
  location?: Location;
}

export interface Location {
  locationId: string;
  name: string;
  managers?: User[];
  stockLevels?: ProductStockLevel[];
  invoices?: Invoice[];
}

export interface Product {
  productId: string;
  name: string;
  chineseName?: string;
  price: number;
  minimumStock?: number;
  vendorId?: string;
  vendor?: Vendor;
  stockLevels?: ProductStockLevel[];
  invoiceItems?: InvoiceItem[];
  stockQuantity?: number; // Total stock quantity calculated from stockLevels
}

export interface NewProduct {
  name: string;
  chineseName?: string;
  price: number;
  minimumStock?: number;
  vendorId?: string;
}

export interface Pagination {
  totalInvoices: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface InvoicesResponse {
  data: Invoice[];
  pagination: Pagination;
}

export interface GetInvoicesParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  vendorId?: string;
  locationId?: string;
  status?: string;
}

export interface ProductsResponse {
  data: Product[]; // Array of products
  pagination: Pagination; // Pagination details
}

export interface GetProductsParams {
  page?: number; // Page number for pagination
  limit?: number; // Number of items per page
  search?: string; // Search term for filtering products
  sortBy?: string; // Sorting field (e.g., name, price)
  sortOrder?: "asc" | "desc"; // Sorting order (ascending or descending)
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Products", "Users", "Invoices", "Vendors", "Locations"],
  endpoints: (build) => ({
    // Fetch low stock products
    getLowStockProducts: build.query<
      ProductsResponse,
      GetProductsParams | void
    >({
      query: (params) => ({
        url: "/products/low-stock",
        params: params ? params : {},
      }),
      providesTags: ["Products"],
    }),

    // Fetch all products
    getProducts: build.query<ProductsResponse, GetProductsParams | void>({
      query: (params) => ({
        url: "/products",
        params: params ? params : {},
      }),
      providesTags: ["Products"],
    }),

    // Create a new product
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // Fetch all users
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // Fetch invoices
    getInvoices: build.query<InvoicesResponse, GetInvoicesParams | void>({
      query: (params) => ({
        url: "/invoices",
        params: params ? params : {},
      }),
      providesTags: ["Invoices"],
    }),

    // Fetch vendors for filtering
    getVendors: build.query<Vendor[], void>({
      query: () => "/vendors",
      providesTags: ["Vendors"],
    }),

    // Fetch locations for filtering
    getLocations: build.query<Location[], void>({
      query: () => "/locations",
      providesTags: ["Locations"],
    }),
  }),
});

export const {
  useGetLowStockProductsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetUsersQuery,
  useGetInvoicesQuery, // <--- New Hook for fetching invoices
  useGetVendorsQuery, // <--- New Hook for fetching vendors
  useGetLocationsQuery, // <--- New Hook for fetching locations
} = api;
