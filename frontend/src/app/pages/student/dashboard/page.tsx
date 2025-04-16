"use client";
import CategoryFilter from "../../../components/Student/CategoryFilter";
import StudentEvents from "../../../components/Student/Events";
import { useState } from "react";
import { Event } from "../../../types";
import SidebarLayout from "@/app/components/Student/Sidebar";
import StudentHeader from "@/app/components/Student/Header";

const StudentDashboard = () => {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  return (
    <SidebarLayout>
      <div>
        <StudentHeader />
        <StudentEvents filteredEvents={filteredEvents} />
      </div>
    </SidebarLayout>
  );
};

export default StudentDashboard;
