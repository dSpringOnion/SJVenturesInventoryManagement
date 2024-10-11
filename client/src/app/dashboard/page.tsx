"use client";

import {
  CheckCircle,
  Package,
  Tag,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import StatCard from "./StatCard";
import { useGetInvoicesQuery, useGetUsersQuery } from "@/state/api";

const Dashboard = () => {
  // Fetch all users - this needs to be refined to get the current user
  const { data: users } = useGetUsersQuery();

  // Assuming there's logic to get the current user, for example:
  const currentUser = users?.find((user) => user.email === "user@example.com"); // Update this logic based on how you manage current user authentication

  // Check if the current user is an admin
  const isAdmin = currentUser?.role === "ADMIN";

  // Fetch new/unread invoices for admin inbox
  const {
    data: invoicesData,
    isLoading,
    isError,
  } = useGetInvoicesQuery({
    status: "PENDING", // Fetch pending invoices for admin attention
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      {/* Admin Inbox - Visible only for Admins */}
      {isAdmin && (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">
            Admin Inbox - Pending Invoices
          </h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : isError ? (
            <div>Error loading invoices</div>
          ) : invoicesData?.data.length === 0 ? (
            <div>No new invoices</div>
          ) : (
            <div className="space-y-4">
              {invoicesData?.data.slice(0, 5).map((invoice) => (
                <div key={invoice.invoiceId} className="border p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span>Manager: {invoice.manager?.name || "Unknown"}</span>
                    <span>
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    Location: {invoice.location?.name || "Unknown Location"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stat Cards - Keeping only relevant metrics */}
      <StatCard
        title="Sales & Discount"
        primaryIcon={<Tag className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Sales",
            amount: "1000.00",
            changePercentage: 20,
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: "200.00",
            changePercentage: -10,
            IconComponent: TrendingDown,
          },
        ]}
      />

      <StatCard
        title="Customer & Expenses"
        primaryIcon={<Package className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Customer Growth",
            amount: "175.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Expenses",
            amount: "10.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />

      <StatCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-blue-600 w-6 h-6" />}
        dateRange="22 - 29 October 2023"
        details={[
          {
            title: "Dues",
            amount: "250.00",
            changePercentage: 131,
            IconComponent: TrendingUp,
          },
          {
            title: "Pending Orders",
            amount: "147",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
