"use client";

import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "../../styles/header.module.css"; // Import the CSS styles

const StudentHeader = () => {
  const [studentName, setStudentName] = useState("");
  const [showProfile, setShowProfile] = useState(false); // State to manage profile modal visibility
  const [studentDetails, setStudentDetails] = useState(null); // State to store student profile details

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem("studentToken");
        const res = await api.get("/students/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch student info", err);
      }
    };

    fetchStudentProfile();
  }, []);

  // Function to handle profile modal visibility and fetch details
  const handleProfileClick = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const res = await api.get("/students/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentDetails(res.data); // Set student details for the modal
      setShowProfile(true); // Show profile modal
    } catch (err) {
      console.error("Failed to fetch student profile details", err);
    }
  };

  // Function to close the profile modal
  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  return (
    <div className={styles.headerContainer}>
      <h2>Welcome, {studentName || "Student"}!</h2>
      <button className={styles.profileButton} onClick={handleProfileClick}>
        View Profile
      </button>

      {/* Profile Modal */}
      {showProfile && studentDetails && (
        <div className={styles.profileModal}>
          <div className={styles.profileContent}>
            <h3>Student Profile</h3>
            <p><strong>Name:</strong> {studentDetails.name}</p>
            <p><strong>Email:</strong> {studentDetails.email}</p>
            <button onClick={handleCloseProfile} className={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHeader;
