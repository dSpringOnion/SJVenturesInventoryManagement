"use client";

import {
  useGetInvoicesQuery,
  useGetVendorsQuery,
  useGetLocationsQuery,
} from "@/state/api";
import { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type AggregatedDataItem = {
  name: string;
  color?: string;
  quantity: number;
  minimumStock?: number;
};

type AggregatedData = {
  [product: string]: AggregatedDataItem;
};

const Invoices = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const {
    data: invoicesData,
    isLoading,
    isError,
  } = useGetInvoicesQuery({
    vendorId: selectedVendor,
    locationId: selectedLocation,
    startDate,
    endDate,
  });
  const { data: vendors } = useGetVendorsQuery();
  const { data: locations } = useGetLocationsQuery();

  const invoices = useMemo(() => invoicesData?.data ?? [], [invoicesData]);

  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const aggregatedData: AggregatedDataItem[] = useMemo(() => {
    const filtered: AggregatedData = invoices
      .filter((invoice) => {
        const invoiceDate = parseDate(invoice.createdAt);
        const matchesDate =
          !startDate ||
          !endDate ||
          (invoiceDate >= startDate && invoiceDate <= endDate);

        const matchesVendor =
          selectedVendor === "All" ||
          invoice.items?.some(
            (item) => item?.product?.vendorId === selectedVendor
          );

        const matchesLocation =
          selectedLocation === "All" || invoice.locationId === selectedLocation;

        return matchesDate && matchesVendor && matchesLocation;
      })
      .reduce((acc: AggregatedData, invoice) => {
        invoice.items?.forEach((item) => {
          // Ensure item and item.product are defined
          if (item?.product) {
            const productName = item.product.name || "Unknown Product";
            const minimumStock = item.product.minimumStock || 0;

            if (!acc[productName]) {
              acc[productName] = {
                name: productName,
                quantity: 0,
                minimumStock,
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
              };
            }

            acc[productName].quantity += item.quantity;
          }
        });
        return acc;
      }, {});

    return Object.values(filtered);
  }, [invoices, startDate, endDate, selectedVendor, selectedLocation]);

  const classNames = {
    label: "block text-sm font-medium text-gray-700",
    selectInput:
      "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };

  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVendor(e.target.value);
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !invoicesData) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch invoices
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-5">
        <Header name="Invoices" />
        <p className="text-sm text-gray-500">
          A visual representation of invoice items over time.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Filter by Vendor, Location, and Date
          </h3>
          <div className="space-y-4">
            {/* VENDOR FILTER */}
            <div>
              <label htmlFor="vendor" className={classNames.label}>
                Vendor
              </label>
              <select
                id="vendor"
                name="vendor"
                className={classNames.selectInput}
                onChange={handleVendorChange}
              >
                <option value="All">All</option>
                {vendors?.map((vendor) => (
                  <option key={vendor.vendorId} value={vendor.vendorId}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION FILTER (For Area Managers and Admins Only) */}
            <div>
              <label htmlFor="location" className={classNames.label}>
                Location
              </label>
              <select
                id="location"
                name="location"
                className={classNames.selectInput}
                onChange={handleLocationChange}
              >
                <option value="All">All</option>
                {locations?.map((location) => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* START DATE */}
            <div>
              <label htmlFor="start-date" className={classNames.label}>
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                className={classNames.selectInput}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* END DATE */}
            <div>
              <label htmlFor="end-date" className={classNames.label}>
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                className={classNames.selectInput}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* PIE CHART */}
        <div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                label
                outerRadius={150}
                fill="#8884d8"
                dataKey="quantity"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {aggregatedData.map(
                  (entry: AggregatedDataItem, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.quantity <= (entry.minimumStock ?? 0) // Default to 0 if minimumStock is undefined
                          ? "red" // Highlight in red if below or at minimum stock
                          : index === activeIndex
                          ? "rgb(29, 78, 216)" // Highlight the selected item
                          : entry.color // Default color for other items
                      }
                    />
                  )
                )}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
