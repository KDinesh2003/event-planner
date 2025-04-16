const pool = require("../db");

// Get all events created by an organizer with registration count
exports.getEventsByOrganizer = async (organizerId) => {
  if (!organizerId) {
    console.error("Organizer ID is undefined or null");
    throw new Error("Organizer ID is undefined or null");
  }
  console.log("Fetching events for organizer ID:", organizerId); // Log the organizerId for debugging
  const [rows] = await pool.execute(
    `SELECT e.*, COUNT(r.student_id) AS registration_count
FROM events e
LEFT JOIN registrations r ON r.event_id = e.id
WHERE e.organizer_id = ? 
  AND (e.date >= CURDATE() 
       OR (e.date = CURDATE() AND e.time >= CURTIME()))  -- Ensures only upcoming events are selected
GROUP BY e.id;

`,
    [organizerId]
  );
  return rows;
};

// Verify that an event belongs to the organizer
exports.isEventOwnedByOrganizer = async (eventId, organizerId) => {
  const [[event]] = await pool.execute(
    `SELECT * FROM events WHERE id = ? AND organizer_id = ?`,
    [eventId, organizerId]
  );

  return event; // returns the event object or undefined
};

// Get students registered for a specific event
exports.getRegisteredStudentsForEvent = async (eventId) => {
  const [students] = await pool.execute(
    `SELECT s.id, s.name, s.email, s.college
     FROM students s
     JOIN registrations r ON s.id = r.student_id
     WHERE r.event_id = ?`,
    [eventId]
  );

  return students;
};

exports.findByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT * FROM organizers WHERE email = ?",
    [email]
  );
  return rows[0];
};

exports.createOrganizer = async ({ name, email, password, organization }) => {
  const [result] = await pool.execute(
    "INSERT INTO organizers (name, email, password, organization_name) VALUES (?, ?, ?, ?)",
    [name, email, password, organization]
  );
  return result.insertId;
};

exports.getOrganizerById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email FROM organizers WHERE id = ?",
    [id]
  );
  return rows.length > 0 ? rows[0] : null; // If no organizer found, return null
};

exports.fetchCategories = async () => {
  try {
    console.log("fetchCategories");
    const [categories] = await pool.execute("SELECT * FROM categories");
    console.log("fetchcategories from db ", categories);

    return [categories];
  } catch (err) {
    console.error(" fetching categories", err);
    throw new Error("Failed to fetch categories");
  }
};

// Create a new event
exports.createEvent = async (eventData, categories) => {
  const { title, description, date, time, location, organizerId } = eventData;

  try {
    // Start a transaction
    await db.beginTransaction();

    // Insert into events table
    const [eventResult] = await pool.execute(
      `INSERT INTO events (title, description, date, time, location, organizer_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, date, time, location, organizerId]
    );

    const eventId = eventResult.insertId;

    // Insert event categories (many-to-many relationship)
    for (const categoryId of categories) {
      await pool.execute(
        `INSERT INTO event_categories (event_id, category_id) VALUES (?, ?)`,
        [eventId, categoryId]
      );
    }

    // Commit the transaction
    await pool.commit();

    return eventId;
  } catch (err) {
    // Rollback if there's an error
    await pool.rollback();
    console.error("Error creating event", err);
    throw new Error("Failed to create event");
  }
};
