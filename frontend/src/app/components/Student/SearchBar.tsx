import { useState } from "react";
import api from "@/app/utils/api";
import styles from "../../styles/searchBar.module.css"; // Import the CSS module

interface SearchBarProps {
  onSearch: (filteredEvents: any[]) => void; // Callback function to pass filtered events back to parent
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem("studentToken");
      const res = await api.get("/events/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { keyword: searchKeyword },
      });
  
      console.log("Search result:", res.data);
      onSearch(res.data);
    } catch (err) {
      console.error("Error searching events", err);
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.container}>
      <input
        type="text"
        placeholder="Search events..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
