"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../../styles/sidebar.module.css";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    router.push("/pages/auth/student-login");
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <nav className={styles.nav}>
          <Link href="/pages/student/dashboard" className={styles.navItem}>
            Home
          </Link>
          <Link href="/pages/student/my-event" className={styles.navItem}>
            My Events
          </Link>
          <Link href="/pages/student/past-events" className={styles.navItem}>
            Past Events
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
