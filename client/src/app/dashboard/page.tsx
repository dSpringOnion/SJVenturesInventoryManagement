"use client";

import {
    CheckCircle,
    Package,
    Tag,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import StatCard from "./StatCard";
import { useGetUsersQuery } from "@/state/api";
import LowStockCard from "@/app/dashboard/LowStockCard";
import CardSalesSummary from "@/app/dashboard/CardSalesSummary";

const Dashboard = () => {
    // Fetch all users - refine to get the current user
    const { data: users } = useGetUsersQuery();

    // Assuming there's logic to get the current user, for example:
    const currentUser = users?.find((user) => user.email === "user@example.com"); // Update this based on user auth

    // Check if the current user is an admin
    const isAdmin = currentUser?.role === "ADMIN";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
            {/* Admin Inbox - Visible only for Admins */}
            {isAdmin && <CardSalesSummary />}

            {/* Low Stock Products - Visible for all users */}
            <LowStockCard />

            {/* Stat Cards - Original metrics */}
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