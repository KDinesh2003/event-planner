import SidebarLayout from "../../../components/Organizer/Sidebar";
import CreateEventForm from "../../../components/Organizer/CreateEventForm";

const CreateEventPage = () => {
  return (
    <SidebarLayout>
      <div>
        <h1
          style={{
            color: "#c2185b",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Create a New Event
        </h1>
        <CreateEventForm />
      </div>
    </SidebarLayout>
  );
};

export default CreateEventPage;
