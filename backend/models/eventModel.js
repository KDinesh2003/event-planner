const pool = require("../db");

// Create a new event
exports.insertEvent = async (eventData) => {
  const { title, description, date, time, location, organizerId } = eventData;

  const [result] = await pool.execute(
    `INSERT INTO events (title, description, date, time, location, organizer_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, date, time, location, organizerId]
  );

  return result.insertId;
};

exports.insertEventCategories = async (eventId, categories) => {
  const insertPromises = categories.map((categoryId) =>
    pool.execute(
      `INSERT INTO event_categories (event_id, category_id) VALUES (?, ?)`,
      [eventId, categoryId]
    )
  );

  await Promise.all(insertPromises);
};

// Link event with categories
exports.linkCategories = async (eventId, categoryIds) => {
  for (const categoryId of categoryIds) {
    await pool.execute(
      `INSERT INTO event_categories (event_id, category_id) VALUES (?, ?)`,
      [eventId, categoryId]
    );
  }
};

// Get all events with organizer name
exports.fetchAllEvents = async () => {
  const [events] = await pool.execute(
    `SELECT 
      e.id,
      e.title,
      e.description,
      e.date,
      e.time,
      e.location,
      e.organizer_id,
      o.name AS organizer_name,
      c.name AS category_name,
      COUNT(r.id) AS registration_count
    FROM events e
    JOIN organizers o ON e.organizer_id = o.id
    JOIN event_categories ec ON e.id = ec.event_id
    JOIN categories c ON ec.category_id = c.id
    LEFT JOIN registrations r ON e.id = r.event_id
    WHERE (e.date > CURDATE())  -- For events after today
       OR (e.date = CURDATE() AND e.time >= CURTIME())  -- For events today, check if time is in the future
    GROUP BY e.id, e.title, e.description, e.date, e.time, e.location, e.organizer_id, o.name, c.name
    ORDER BY e.date ASC, e.time ASC;`
  );

  return events;
};


// Get categories for a given event
exports.getEventCategories = async (eventId) => {
  const [categories] = await pool.execute(
    `SELECT c.name FROM categories c
     JOIN event_categories ec ON c.id = ec.category_id
     WHERE ec.event_id = ?`,
    [eventId]
  );

  return categories.map((c) => c.name);
};

// Get detailed event info by ID
exports.fetchEventById = async (id) => {
  const [[event]] = await pool.execute(
    `SELECT e.*, o.name AS organizer_name
     FROM events e JOIN organizers o ON e.organizer_id = o.id
     WHERE e.id = ?`,
    [id]
  );

  return event;
};

// Get registration count
exports.getEventRegistrationCount = async (id) => {
  const [[{ registered_count }]] = await pool.execute(
    `SELECT COUNT(*) AS registered_count FROM registrations WHERE event_id = ?`,
    [id]
  );

  return registered_count;
};

// In your model file (e.g., registrationModel.js)

// Function to check if the student is already registered for the event
exports.checkIfRegistered = async (studentId, eventId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM registrations WHERE student_id = ? AND event_id = ?",
    [studentId, eventId]
  );
  return rows; // Returns the existing registration (if any)
};

// Function to register the student for the event
exports.registerForEvent = async (studentId, eventId) => {
  const now = new Date();

  // Get UTC milliseconds + IST offset (5 hours 30 mins)
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffsetMs);

  // Format IST date to 'YYYY-MM-DD HH:MM:SS'
  const registeredAt = istDate.toISOString().replace("T", " ").slice(0, 19);

  const [result] = await pool.execute(
    "INSERT INTO registrations (student_id, event_id, registered_at) VALUES (?, ?, ?)",
    [studentId, eventId, registeredAt]
  );

  return result;
};
