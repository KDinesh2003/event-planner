"use client";

import SidebarLayout from "../../../components/Student/Sidebar";
import StudentHeader from "../../../components/Student/Header";
import PastEventsPage from "@/app/components/Student/PastEvents";

const StudentDashboard = () => {
  return (
    <SidebarLayout>
      <div>
        <StudentHeader /> 
        <PastEventsPage />{" "}
      </div>
    </SidebarLayout>
  );
};

export default StudentDashboard;
