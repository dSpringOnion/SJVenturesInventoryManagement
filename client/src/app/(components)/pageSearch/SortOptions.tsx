import React from "react";

interface SortProps {
  sortBy: string;
  sortOrder: "asc" | "desc"; // Restrict sortOrder to "asc" or "desc"
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void; // Adjust the callback type
}

const SortOptions: React.FC<SortProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value, sortOrder); // Pass the current sortOrder
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(sortBy, e.target.value as "asc" | "desc"); // Ensure the correct type for sortOrder
  };

  return (
    <div className="sort-options">
      <select value={sortBy} onChange={handleSortByChange}>
        <option value="name">Name</option>
        <option value="price">Price</option>
        {/* Add other sorting fields if necessary */}
      </select>
      <select value={sortOrder} onChange={handleSortOrderChange}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortOptions;
