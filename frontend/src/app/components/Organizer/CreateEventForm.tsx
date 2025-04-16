/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import styles from "../../styles/createEventForm.module.css"; // Import the styles
import { useRouter } from "next/navigation";

const CreateEventForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState<number[]>([]); // Array to hold selected category IDs
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]); // Make sure it's always an array

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("organizerToken");

        const res = await api.get("/organizers/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }); // Fetch categories from the backend

        console.log("Categories fetched:", res.data); // Log the response to debug

        // Check if res.data is an array or object and set categoryOptions accordingly
        if (Array.isArray(res.data)) {
          setCategoryOptions(res.data);
        } else if (res.data && Array.isArray(res.data.categories)) {
          setCategoryOptions(res.data.categories); // In case categories is wrapped inside a nested object
        } else {
          console.error("Unexpected response format:", res.data);
          setCategoryOptions([]); // Fallback to empty array if format is not expected
        }
      } catch (err) {
        console.error("Error fetching categories", err);
        setCategoryOptions([]); // Set to empty array in case of error
      }
    };

    fetchCategories();
  }, []);
  const handleCategoryChange = (categoryId: number) => {
    setCategories([categoryId]); // Always set the state to only the selected category
  };
  const getMinTime = () => {
    const now = new Date();
    const selectedDate = new Date(date);
    const isToday = selectedDate.toDateString() === now.toDateString();

    if (isToday) {
      // Format current time as HH:MM
      return now.toTimeString().slice(0, 5);
    }

    return "00:00"; // Allow full range for future days
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("organizerToken");
      console.log(token); // Check if the token is being passed

      console.log(categories);

      const res = await api.post(
        "/organizers/create-event",
        { title, description, date, time, location, categories },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Event created successfully!");
        router.push("/pages/organizer/dashboard");

        // Optionally, reset the form here
      }
    } catch (err) {
      console.error("Error creating event", err);
      alert("Failed to create event.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.formLabel}>
          Event Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.formLabel}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="date" className={styles.formLabel}>
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          min={new Date().toISOString().split("T")[0]} // 👈 disables past dates
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="time" className={styles.formLabel}>
          Time
        </label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          min={getMinTime()}
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="location" className={styles.formLabel}>
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Categories</label>
        {categoryOptions.map((category) => (
          <div key={category.id} className={styles.categoryOption}>
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={categories.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
              className={styles.checkbox}
            />
            <label
              htmlFor={`category-${category.id}`}
              className={styles.checkboxLabel}
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.submitButton}>
          Create Event
        </button>
      </div>
    </form>
  );
};

export default CreateEventForm;
