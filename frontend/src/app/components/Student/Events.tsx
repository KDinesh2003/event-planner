"use client";

import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Event } from "../../types";
import styles from "../../styles/studentDashboard.module.css";
import CategoryFilter from "./CategoryFilter"; // ✅ import filter
import SearchBar from "./SearchBar";

const StudentEvents = () => {
  const [events, setEvents] = useState<Event[]>([]); // All fetched events
  const [filteredEvents, setFilteredEvents] = useState<Event[] | null>(null); // Filtered events
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]); // State for displayed events
  const [searchKeyword, setSearchKeyword] = useState<string>(""); // Search keyword
  const [showOrganizerProfile, setShowOrganizerProfile] = useState(false);
  const [organizerDetails, setOrganizerDetails] = useState<any>(null);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("studentToken");
        const res = await api.get("/students/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data); // Store all events
        setDisplayedEvents(res.data); // Initially display all events
      } catch (err) {
        console.error("Error loading events", err);
      }
    };

    fetchEvents();
  }, []);

  // Handle filter logic
  const handleFilter = (filtered: Event[]) => {
    setFilteredEvents(filtered); // Update filtered events
    setSelectedEvent(null); // Clear selected event when filter is applied
  };

  // Handle search logic
  const handleSearch = (filteredEvents: Event[]) => {
    setDisplayedEvents(filteredEvents); // Update the displayed events based on search results
  };

  // Effect to handle search updates
  useEffect(() => {
    if (searchKeyword.trim() === "") {
      // If no keyword, show events based on the filter
      setDisplayedEvents(filteredEvents || events);
    } else {
      // If there is a search keyword, filter events based on it
      const lowerCaseKeyword = searchKeyword.toLowerCase();
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(lowerCaseKeyword) ||
          event.description.toLowerCase().includes(lowerCaseKeyword)
      );
      setDisplayedEvents(filtered);
    }
  }, [searchKeyword, events, filteredEvents]); // Re-run whenever searchKeyword or events/filteredEvents change

  // Format event date
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle event click to select
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    console.log(event);

    // setIsRegistered(false);
  };

  // Register for an event
  const handleRegister = async () => {
    try {
      const token = localStorage.getItem("studentToken");

      const checkRes = await api.get(
        `/students/check-registration/${selectedEvent?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (checkRes.data.isRegistered) {
        setIsRegistered(true);
        return;
      }

      const res = await api.post(
        `/students/register/${selectedEvent?.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        setIsRegistered(true);
      }
    } catch (err) {
      console.error("Error registering for the event", err);
    }
  };
  const isToday = (eventDate: string) => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);

    return (
      today.getDate() === eventDateObj.getDate() &&
      today.getMonth() === eventDateObj.getMonth() &&
      today.getFullYear() === eventDateObj.getFullYear()
    );
  };
  const handleOrganizerClick = async () => {
    try {
      const token = localStorage.getItem("organizerToken");
      const res = await api.get("/organizers/details", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrganizerDetails(res.data);
      setShowOrganizerProfile(true); // Show the profile modal
    } catch (err) {
      console.error("Failed to fetch organizer info", err);
    }
  };
  const handleShare = async () => {
    const formattedTitle = selectedEvent.title
      .toLowerCase()
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/[^\w-]+/g, ""); // remove non-alphanumeric characters

    const shareUrl = `http://localhost:3000/pages/student/dashboard/event/${formattedTitle}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Fetch registration status based on selected event
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const token = localStorage.getItem("studentToken");
        const res = await api.get(
          `/students/check-registration/${selectedEvent?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("businese clickeed: ", res.data);

        setIsRegistered(res.data.isRegistered);
      } catch (err) {
        console.error("Error fetching registration status", err);
      }
    };

    if (selectedEvent) {
      fetchRegistrationStatus();
    }
  }, [selectedEvent]);

  return (
    <div>
      <h1
        style={{
          color: "#c2185b",
          fontSize: "1.8rem",
          fontWeight: "bold",
          textAlign: "center", // Centering horizontally
          margin: "0 auto",
          paddingBottom: "25px", // To ensure the element is centered (optional)
          width: "fit-content", // Ensures the element's width only fits the content, preventing stretching
        }}
      >
        Upcoming Events
      </h1>

      <SearchBar onSearch={handleSearch} />

      {/* ✅ Category Filter added here */}
      <CategoryFilter onFilter={handleFilter} />

      <div className={styles.tableContainer}>
        {displayedEvents.length === 0 ? (
          <p style={{ fontSize: "1.2rem", color: "#555" }}>
            No upcoming events.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {displayedEvents.map((event) => (
                <tr
                  key={event.id}
                  className={`${styles.tableRow} ${
                    isToday(event.date) ? styles.todayEvent : ""
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                  <td>{event.title}</td>
                  <td>
                    {formatDate(event.date)} at {event.time.slice(0, 5)}
                    {isToday(event.date) && (
                      <span className={styles.todayIndicator}> Today</span>
                    )}
                  </td>
                  <td>{event.location}</td>
                  <td>{event.category_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedEvent && (
          <div className={styles.eventDetails}>
            <h2>{selectedEvent.title}</h2>
            <p>
              <strong>Organizer:</strong>
              <span
                className={styles.organizerName}
                onClick={() => handleOrganizerClick()}
              >
                {selectedEvent.organizer_name}
              </span>
            </p>
            <p>
              <strong>Date:</strong> {formatDate(selectedEvent.date)} at
              {selectedEvent.time.slice(0, 5)}
            </p>
            <p>
              <strong>Location:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Category:</strong> {selectedEvent.category_name}
            </p>
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
            <p>
              <strong>Students Registered:</strong>
              {selectedEvent.registration_count}
            </p>
            <button className={styles.shareButton} onClick={handleShare}>
              Share Event
            </button>

            {isRegistered ? (
              <p style={{ color: "green" }}>
                You are registered for this event!
              </p>
            ) : (
              <button
                className={styles.registerButton}
                onClick={handleRegister}
              >
                Register for Event
              </button>
            )}
          </div>
        )}
        {showOrganizerProfile && organizerDetails && (
          <div className={styles.profileModal}>
            <div className={styles.profileContent}>
              <h3>Organizer Profile</h3>
              <p>
                <strong>ID:</strong> {organizerDetails.id}
              </p>
              <p>
                <strong>Name:</strong> {organizerDetails.name}
              </p>
              <p>
                <strong>Email:</strong> {organizerDetails.email}
              </p>
              <p>
                <strong>Organization:</strong>{" "}
                {organizerDetails.organization_name}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(organizerDetails.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => setShowOrganizerProfile(false)} // Close modal
                className={styles.closeButton}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEvents;
