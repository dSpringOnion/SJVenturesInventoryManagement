"use client";

import { useState, useEffect } from "react";
import { useGetInvoicesQuery, useGetVendorsQuery, useCreateInvoiceMutation } from "@/state/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";

const Expenses = () => {
    const router = useRouter();
    const [vendorId, setVendorId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    // Fetch invoices, vendors, and locations data
    const { data: invoices, isLoading, isError } = useGetInvoicesQuery({ vendorId, locationId, startDate, endDate });
    const { data: vendors } = useGetVendorsQuery();
    const [createInvoice, { isLoading: isCreatingInvoice }] = useCreateInvoiceMutation();

    // Handle new invoice item addition
    const handleAddInvoiceItem = () => {
        setInvoiceItems([...invoiceItems, { productId: "", quantity: 1 }]);
    };

    // Handle invoice item change
    const handleInvoiceItemChange = (index: number, field: string, value: any) => {
        const items = [...invoiceItems];
        items[index][field] = value;
        setInvoiceItems(items);
    };

    // Handle invoice creation
    const handleCreateInvoice = async () => {
        setIsCreating(true);
        try {
            await createInvoice({
                locationId,
                items: invoiceItems
            });
            alert("Invoice created successfully!");
            setInvoiceItems([]);
        } catch (error) {
            console.error("Error creating invoice:", error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen p-6 bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">Manage Expenses and Invoices</h1>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <select
                    className="p-2 border rounded"
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                >
                    <option value="">All Vendors</option>
                    {vendors?.map((vendor) => (
                        <option key={vendor.vendorId} value={vendor.vendorId}>
                            {vendor.name}
                        </option>
                    ))}
                </select>

                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Start Date"
                    className="p-2 border rounded"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="End Date"
                    className="p-2 border rounded"
                />
                <button
                    className="p-2 bg-blue-500 text-white rounded-md"
                    onClick={() => router.reload()}
                >
                    Apply Filters
                </button>
            </div>

            {/* Invoices Display */}
            <div className="mb-6">
                {isLoading ? (
                    <div>Loading...</div>
                ) : isError ? (
                    <div className="text-red-500">Error loading invoices.</div>
                ) : (
                    <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                        <tr className="border-b">
                            <th className="p-4 text-left">Invoice ID</th>
                            <th className="p-4 text-left">Vendor</th>
                            <th className="p-4 text-left">Location</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices?.map((invoice) => (
                            <tr key={invoice.invoiceId} className="border-b">
                                <td className="p-4">{invoice.invoiceId}</td>
                                <td className="p-4">{invoice.vendor?.name || "Unknown"}</td>
                                <td className="p-4">{invoice.location?.name || "Unknown"}</td>
                                <td className="p-4">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">{invoice.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create Invoice Section */}
            <div className="bg-white p-6 rounded-md shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Create New Invoice</h2>

                <div className="flex flex-col gap-4 mb-4">
                    {invoiceItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Product ID"
                                value={item.productId}
                                onChange={(e) =>
                                    handleInvoiceItemChange(index, "productId", e.target.value)
                                }
                                className="p-2 border rounded"
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                    handleInvoiceItemChange(index, "quantity", parseInt(e.target.value))
                                }
                                className="p-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddInvoiceItem()}
                                className="p-2 bg-green-500 text-white rounded-md"
                            >
                                Add Item
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    className="p-2 bg-blue-600 text-white rounded-md"
                    onClick={handleCreateInvoice}
                    disabled={isCreatingInvoice}
                >
                    {isCreatingInvoice ? "Creating Invoice..." : "Create Invoice"}
                </button>
            </div>
        </div>
    );
};

export default Expenses;
