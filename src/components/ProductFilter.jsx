import React from "react";
import "../style/ProductFilter.css";

const categories = ["Tất cả", "Trái cây Việt Nam", "Nhập khẩu", "Quà tặng"];

const ProductFilter = ({ filter, setFilter }) => {
  return (
    <div className="container mt-4 d-flex justify-content-start mb-4 mt-4">
      <select
        className="form-select w-auto"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProductFilter;
