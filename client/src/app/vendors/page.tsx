"use client";

import { useGetVendorsQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Switch } from "@headlessui/react";
import { useState } from "react";

const columns: GridColDef[] = [
  { field: "vendorId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Vendor Name", width: 200 },
  {
    field: "isActive",
    headerName: "Status",
    width: 130,
    renderCell: (params: any) => (
      <VendorStatusToggle
        isActive={params.row.isActive}
        vendorId={params.row.vendorId}
      />
    ),
  },
];

const VendorStatusToggle = ({
  isActive,
  vendorId,
}: {
  isActive: boolean;
  vendorId: string;
}) => {
  const [enabled, setEnabled] = useState(isActive);

  const handleToggle = () => {
    // Here you can implement the logic to update the vendor status via mutation
    setEnabled(!enabled);
    // Call your mutation to update vendor status in the backend
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleToggle}
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-300"
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out`}
    >
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
      />
    </Switch>
  );
};

const Vendors = () => {
  const { data: vendors, isError, isLoading } = useGetVendorsQuery();

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !vendors) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch vendors
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Header name="Vendors" />
      <DataGrid
        rows={vendors}
        columns={columns}
        getRowId={(row) => row.vendorId}
        checkboxSelection
        className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
      />
    </div>
  );
};

export default Vendors;
