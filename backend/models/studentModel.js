const pool = require("../db");

// Check if student is already registered for the event
exports.isAlreadyRegistered = async (studentId, eventId) => {
  const [result] = await pool.execute(
    `SELECT * FROM registrations WHERE student_id = ? AND event_id = ?`,
    [studentId, eventId]
  );
  return result.length > 0;
};

// Register the student for an event
exports.registerForEvent = async (studentId, eventId) => {
  await pool.execute(
    `INSERT INTO registrations (student_id, event_id) VALUES (?, ?)`,
    [studentId, eventId]
  );
};

// Cancel event registration
exports.cancelRegistration = async (studentId, eventId) => {
  await pool.execute(
    `DELETE FROM registrations WHERE student_id = ? AND event_id = ?`,
    [studentId, eventId]
  );
};

// Get events registered by the student
exports.getRegisteredEvents = async (studentId) => {
  const [events] = await pool.execute(
    `SELECT e.id, e.title, e.date, e.time, e.location
     FROM events e
     JOIN registrations r ON e.id = r.event_id
     WHERE r.student_id = ?
     ORDER BY e.date ASC`,
    [studentId]
  );
  return events;
};

exports.findByEmail = async (email) => {
  const [rows] = await pool.execute("SELECT * FROM students WHERE email = ?", [
    email,
  ]);
  return rows[0]; // Returns the first student if found, or undefined
};


exports.getStudentById = async (id) => {
    const [rows] = await pool.execute(
      "SELECT id, name, email FROM students WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null; // If no organizer found, return null
  };

// Create a new student
exports.createStudent = async (studentData) => {
  const { name, email, password } = studentData;
  const [result] = await pool.execute(
    `INSERT INTO students (name, email, password) 
       VALUES (?, ?, ?)`,
    [name, email, password]
  );
  return result.insertId; // Return the ID of the newly created student
};
