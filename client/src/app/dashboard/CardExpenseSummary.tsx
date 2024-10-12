"use client";

import { useGetLowStockProductsQuery } from "@/state/api";

const CardLowStock = () => {
    const { data: lowStockProductsResponse, isLoading, isError } =
        useGetLowStockProductsQuery();

    const lowStockProducts = lowStockProductsResponse?.data || [];

    if (isLoading) {
        return <div className="m-5">Loading...</div>;
    }

    if (isError || !lowStockProducts) {
        return <div className="m-5">Error loading low-stock products.</div>;
    }

    if (lowStockProducts.length === 0) {
        return <div className="m-5">No products are currently low in stock.</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Low Stock Products</h2>
            <table className="min-w-full table-auto">
                <thead>
                <tr>
                    <th className="px-4 py-2 text-left">Product Name</th>
                    <th className="px-4 py-2 text-left">Current Stock</th>
                    <th className="px-4 py-2 text-left">Minimum Stock</th>
                </tr>
                </thead>
                <tbody>
                {lowStockProducts.map((product) => {
                    const totalStockQuantity = product.stockLevels
                        ? product.stockLevels.reduce(
                            (total, stockLevel) => total + stockLevel.stockQuantity,
                            0
                        )
                        : 0;

                    return (
                        <tr key={product.productId} className="border-t">
                            <td className="px-4 py-2">{product.name}</td>
                            <td className="px-4 py-2">{totalStockQuantity}</td>
                            <td className="px-4 py-2">{product.minimumStock || 0}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default CardLowStock;