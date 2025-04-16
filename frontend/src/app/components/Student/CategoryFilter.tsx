"use client";
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "../../styles/filter.module.css"; // Import CSS module
import { Event } from "../../types";

type Props = {
  onFilter: (events: Event[]) => void; // Callback to pass filtered events
};

const CategoryFilter = ({ onFilter }: Props) => {
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]); // Use categoryOptions instead of categories
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        const res = await api.get("/organizers/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Categories fetched:", res.data);

        if (Array.isArray(res.data)) {
          setCategoryOptions(res.data);
        } else if (res.data && Array.isArray(res.data.categories)) {
          setCategoryOptions(res.data.categories);
        } else {
          console.error("Unexpected response format:", res.data);
          setCategoryOptions([]);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
        setCategoryOptions([]);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterEvents(category);
  };

  const filterEvents = async (category: string) => {
    try {
      const token = localStorage.getItem("studentToken");
      const res = await api.get("/students/events/filter", {
        headers: { Authorization: `Bearer ${token}` },
        params: { category },
      });

      console.log("Filtered events:", res.data);

      onFilter(res.data); // Passing the filtered events back to parent
    } catch (err) {
      console.error("Error filtering events", err);
    }
  };

  return (
    <div className={styles.categoryFilterContainer}>
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className={styles.categorySelect}
      >
        <option value="">All Categories</option>
        {categoryOptions.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
