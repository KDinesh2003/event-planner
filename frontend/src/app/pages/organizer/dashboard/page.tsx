// pages/organizer/dashboard.tsx
import SidebarLayout from "../../../components/Organizer/Sidebar";
import MyEvents from "../../../components/Organizer/MyEvents";
import Header from "../../../components/Organizer/Header"; // Import Header component

export default function OrganizerDashboard() {
  return (
    <SidebarLayout>
      <div>
        <Header /> {/* Include the Header component here */}
        <MyEvents />
      </div>
    </SidebarLayout>
  );
}
