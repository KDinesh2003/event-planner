"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../../styles/sidebar.module.css";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation"; // For redirection

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();  // Initialize router for redirection

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    // Clear the local storage (assuming token is stored here)
    localStorage.removeItem("organizerToken");

    // Redirect to the login page after logout
    router.push("/pages/auth/organizer-login");  // Update this route based on your actual login path
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <nav className={styles.nav}>
          <Link href="/pages/organizer/dashboard" className={styles.navItem}>
            Home
          </Link>
          <Link href="/pages/organizer/create-event" className={styles.navItem}>
            Create Event
          </Link>
        </nav>

        {/* Logout Button */}
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Toggle */}
      <div className={styles.toggleButton} onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

      {/* Main content */}
      <div className={`${styles.content}`}>
        {children}
      </div>
    </div>
  );
}
