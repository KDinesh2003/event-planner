"use client";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Event, Student } from "../../types";
import styles from "../../styles/organizerDashboard.module.css";

export default function   MyEvents() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [students, setStudents] = useState<Student[]>([]); // State to store registered students

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("organizerToken");
        const res = await api.get("/organizers/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyEvents(res.data);
      } catch (err) {
        console.error("Error loading events", err);
      }
    };

    fetchMyEvents();
  }, []);

  const handleEventClick = async (eventId: number) => {
    try {
      const token = localStorage.getItem("organizerToken");
      const res = await api.get(`/organizers/event/${eventId}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data); // Set students for the clicked event
      setSelectedEvent(myEvents.find((event) => event.id === eventId) || null);
    } catch (err) {
      console.error("Error loading registered students", err);
    }
  };

  if (myEvents.length === 0) {
    return (
      <div>
        <h1 className={styles.header}>My Events</h1>
        <p className={styles.emptyMessage}>No events created yet.</p>
      </div>
    );
  }

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handleDeleteEvent = async (eventId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("organizerToken");
      await api.delete(`/organizers/delete-event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyEvents((prev) => prev.filter((e) => e.id !== eventId)); // Remove from UI
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.header}>My Events</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date & Time</th>
            <th>Location</th>
            <th>Registrations</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {myEvents.map((event) => (
            <tr
              key={event.id} // Ensure that event.id is unique
              className={styles.tableRow}
              onClick={() => handleEventClick(event.id)} // Handle click event
            >
              <td>{event.title}</td>
              <td>
                {formatDate(event.date)} at {event.time.slice(0, 5)}
              </td>
              <td>{event.location}</td>
              <td>{event.registration_count}</td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering handleEventClick
                    handleDeleteEvent(event.id);
                  }}
                >
                  Delete
                </button>
              </td>
              {/* Ensure this is populated */}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEvent && students.length > 0 && (
        <div className={styles.studentsList}>
          <h2
            style={{
              color: "#c2185b",
              fontSize: "2rem", // Slightly larger font size for prominence
              fontWeight: "bold",
              textAlign: "center", // Center-aligned heading
              marginBottom: "20px", // Space below the heading
            }}
          >
            Registered Students for &quot;{selectedEvent.title}&quot;
          </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Registered At</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{new Date(student.registered_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
