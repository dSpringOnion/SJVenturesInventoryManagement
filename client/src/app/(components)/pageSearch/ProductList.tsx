import React, { useState } from "react";
import { useGetProductsQuery } from "@/state/api"; // Import the RTK query hook
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import SortOptions from "./SortOptions";

const ProductList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Fix here
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Fixed page size

  // Use the query hook to fetch products based on search term, sort options, and pagination
  const { data, isLoading, isError } = useGetProductsQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    sortBy,
    sortOrder,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc"
  ) => {
    // Ensure sortOrder type
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page on sort change
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching products</p>;

  return (
    <div className="product-list">
      <SearchBar onSearch={handleSearch} />
      <SortOptions
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />
      {/* Render the list of products */}
      <div className="products">
        {data?.data.map((product) => (
          <div key={product.productId} className="product-item">
            <h3>{product.name}</h3>
            <p>{product.chineseName}</p>
            <p>Price: ${product.price}</p>
            {/* Add more product details as needed */}
          </div>
        ))}
      </div>
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={data?.pagination.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;
