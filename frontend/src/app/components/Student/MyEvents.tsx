import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Event } from "../../types";
import styles from "../../styles/studentDashboard.module.css";

export default function MyEvents() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      const res = await api.get("/students/my-events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyEvents(res.data);
    } catch (err) {
      console.error("Error loading events", err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCancel = async (eventId: number) => {
    try {
      const token = localStorage.getItem("studentToken");
      await api.delete(`/students/unregister/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh the list
      setMyEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error("Error cancelling registration", err);
    }
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (myEvents.length === 0) {
    return (
      <div>
        <h1 className={styles.header}>My Events</h1>
        <p className={styles.emptyMessage}>You are not registered for any events yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.header}>My Events</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date & Time</th>
            <th>Location</th>
            <th>Action</th> 
          </tr>
        </thead>
        <tbody>
          {myEvents.map((event) => (
            <tr key={event.id} className={styles.tableRow}>
              <td>{event.title}</td>
              <td>{formatDate(event.date)} at {event.time.slice(0, 5)}</td>
              <td>{event.location}</td>
              <td>
                <button
                  onClick={() => handleCancel(event.id)}
                  className={styles.cancelBtn}
                >
                  Cancel Registration
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
