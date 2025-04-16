"use client";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
  is_registered: boolean;
}

const PastEventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    // Fetch past events from API
    const fetchPastEvents = async () => {
      try {
        const token = localStorage.getItem("studentToken"); // Assuming the token is stored in localStorage

        const response = await api.get("/students/past-events", {
          headers: {
            Authorization: `Bearer ${token}`, // Adding token to the request headers
          },
        });

        setEvents(response.data.events);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching past events:", error);
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#fff7f9] text-[#000000] px-6 sm:px-20 py-16">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-[#c2185b] text-center mb-12">
        Past Events
      </h1>
      {loading ? (
        <p className="text-center text-xl text-gray-600">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-xl text-gray-500 mt-10">
          No past events found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-[#c2185b] font-semibold text-xl mb-3">
                {event.title}
              </h3>
              <p className="text-sm text-gray-700 mb-3">{event.description}</p>
              <div className="text-sm text-gray-600 mb-4">
                <p>
                  {formatDate(event.date)} | {event.time.slice(0, 5)}
                </p>
                <p>
                  Category:{" "}
                  <span className="font-medium">{event.category}</span>
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span
                  className={`inline-block px-6 py-2 text-white font-semibold rounded-full ${
                    event.is_registered ? "bg-[#c2185b]" : "bg-gray-500"
                  }`}
                >
                  {event.is_registered ? "Registered" : "Not Registered"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastEventsPage;
