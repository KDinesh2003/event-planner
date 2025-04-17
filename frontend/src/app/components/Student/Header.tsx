"use client";

import { useEffect, useState } from "react";
import api from "../../utils/api";
import styles from "../../styles/header.module.css";

interface Event {
  id: number;
  title: string;
  time: string;
  location: string;
}

const StudentHeader = () => {
  const [studentName, setStudentName] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any>(null);

  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState<Event[]>([]);

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
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem("studentToken");
        const res = await api.get("/students/reminders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReminders(res.data.events || []);
      } catch (err) {
        console.error("Failed to fetch reminders", err);
      }
    };

    fetchReminders();
  }, [reminders]);

  // Profile view handler
  const handleProfileClick = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const res = await api.get("/students/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentDetails(res.data);
      setShowProfile(true);
    } catch (err) {
      console.error("Failed to fetch student profile details", err);
    }
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  // Reminders fetch handler
  const handleRemindersClick = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const res = await api.get("/students/reminders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data.events || []);
      setShowReminders(true);
    } catch (err) {
      console.error("Failed to fetch reminders", err);
    }
  };

  const handleCloseReminders = () => {
    setShowReminders(false);
  };

  return (
    <div className={styles.headerContainer}>
      <h2>Welcome, {studentName || "Student"}!</h2>
      <div className={styles.buttonContainer}>/
        <button
          className={styles.reminderButton}
          onClick={handleRemindersClick}
        >
          Reminders 🔔
          {reminders.length > 0 && (
            <span className={styles.notificationDot}></span>
          )}
        </button>

        <button className={styles.profileButton} onClick={handleProfileClick}>
          View Profile
        </button>
      </div>

      {/* Profile Modal */}
      {showProfile && studentDetails && (
        <div className={styles.profileModal}>
          <div className={styles.profileContent}>
            <h3>Student Profile</h3>
            <p>
              <strong>Name:</strong> {studentDetails.name}
            </p>
            <p>
              <strong>Email:</strong> {studentDetails.email}
            </p>
            <button onClick={handleCloseProfile} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reminders Modal */}
      {showReminders && (
        <div className={styles.profileModal}>
          <div className={styles.profileContent}>
            <h3>Upcoming Events (Next Hour)</h3>
            {reminders.length === 0 ? (
              <p>No events starting soon.</p>
            ) : (
              <ul>
                {reminders.map((event) => (
                  <li
                    key={event.id}
                    className="bg-[#fff0f4] border border-[#f8c0d0] rounded-lg p-3 shadow-sm mb-3"
                  >
                    <strong className="text-[#c2185b] block text-sm sm:text-base mb-1">
                      {event.title}
                    </strong>
                    <p className="text-sm text-gray-700">
                      ⏰ {event.time.slice(0, 5)} &nbsp;|&nbsp; 📍{" "}
                      {event.location}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={handleCloseReminders}
              className={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHeader;
