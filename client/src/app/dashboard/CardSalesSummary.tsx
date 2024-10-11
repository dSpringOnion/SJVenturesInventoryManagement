import { useGetInvoicesQuery } from "@/state/api";
import React, { useState } from "react";

const InboxInvoices = () => {
  const { data, isLoading, isError } = useGetInvoicesQuery({
    status: "PENDING",
  });
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  if (isError) {
    return <div className="m-5">Failed to fetch invoices</div>;
  }

  const handleInvoiceClick = (invoiceId: string) => {
    setSelectedInvoice(invoiceId);
    // Here you could mark the invoice as read, or open it for detailed view
  };

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          {/* HEADER */}
          <div>
            <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
              Unread Invoices
            </h2>
            <hr />
          </div>

          {/* BODY */}
          <div className="overflow-y-auto max-h-96 px-7 py-4">
            {data?.data.length === 0 ? (
              <p className="text-center text-gray-500">No unread invoices</p>
            ) : (
              data?.data.map((invoice) => (
                <div
                  key={invoice.invoiceId}
                  className={`p-3 mb-2 cursor-pointer rounded-lg border ${
                    selectedInvoice === invoice.invoiceId
                      ? "bg-blue-100"
                      : "bg-white"
                  }`}
                  onClick={() => handleInvoiceClick(invoice.invoiceId)}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {invoice.manager?.name || "Unknown Manager"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(invoice.createdAt).toLocaleDateString(
                          "en-US"
                        )}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-blue-500">
                      Status: {invoice.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div>
            <hr />
            <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
              <p>{data?.data.length || 0} unread invoices</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InboxInvoices;
