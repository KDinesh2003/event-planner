"use client";

import SidebarLayout from "../../../components/Student/Sidebar";
import StudentHeader from "../../../components/Student/Header";
import MyEvents from "@/app/components/Student/MyEvents";

const StudentDashboard = () => {
  return (
    <SidebarLayout>
      <div>
        <StudentHeader /> 
        <MyEvents />
      </div>
    </SidebarLayout>
  );
};

export default StudentDashboard;
