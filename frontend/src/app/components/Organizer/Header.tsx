"use client";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "../../styles/header.module.css";

const Header = () => {
  const [organizerName, setOrganizerName] = useState<string>("");
  const [showProfile, setShowProfile] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [organizerDetails, setOrganizerDetails] = useState<any>(null); // Store organizer details

  useEffect(() => {
    const fetchOrganizer = async () => {
      try {
        const token = localStorage.getItem("organizerToken");
        const res = await api.get("/organizers/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrganizerName(res.data.name);
      } catch (err) {
        console.error("Failed to fetch organizer info", err);
      }
    };

    fetchOrganizer();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      const token = localStorage.getItem("organizerToken");
      const res = await api.get("/organizers/details", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrganizerDetails(res.data); // Set the organizer details
    } catch (err) {
      console.error("Failed to fetch organizer details", err);
    }
  };

  const handleProfileClick = () => {
    fetchProfileDetails();
    setShowProfile(true); // Show the profile details modal
  };

  const handleCloseProfile = () => {
    setShowProfile(false); // Close the profile details modal
  };

  return (
    <div className={styles.headerContainer}>
      <h2>Welcome, {organizerName || "Organizer"}!</h2>
      <button onClick={handleProfileClick} className={styles.profileButton}>
        View Profile
      </button>

      {/* Profile Details Modal */}
      {showProfile && organizerDetails && (
        <div className={styles.profileModal}>
          <div className={styles.profileContent}>
            <h3>Organizer Profile</h3>
            <p><strong>ID:</strong> {organizerDetails.id}</p>
            <p><strong>Name:</strong> {organizerDetails.name}</p>
            <p><strong>Email:</strong> {organizerDetails.email}</p>
            <p><strong>Organization:</strong> {organizerDetails.organization_name}</p>
            <p><strong>Created At:</strong> {new Date(organizerDetails.created_at).toLocaleString()}</p>
            <button onClick={handleCloseProfile} className={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
