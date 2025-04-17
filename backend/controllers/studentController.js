const studentModel = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const eventModel = require("../models/eventModel");

exports.registerForEvent = async (req, res) => {
  const studentId = req.user.studentId;
  const eventId = req.params.eventId;

  try {
    // Check if the student is already registered for the event
    const existingRegistration = await eventModel.checkIfRegistered(
      studentId,
      eventId
    );

    if (existingRegistration.length > 0) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event." });
    }

    // Register the student for the event
    const registration = await eventModel.registerForEvent(studentId, eventId);

    // Check if registration was successful
    if (registration.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Successfully registered for the event!" });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to register for the event." });
    }
  } catch (err) {
    console.error("Error registering for the event:", err);
    res
      .status(500)
      .json({ message: "An error occurred while registering for the event." });
  }
};
exports.cancelRegistration = async (req, res) => {
  const studentId = req.user.id;
  const { eventId } = req.body;

  try {
    await studentModel.cancelRegistration(studentId, eventId);
    res.json({ message: "Registration cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Cancellation failed" });
  }
};

exports.getMyEvents = async (req, res) => {
  const studentId = req.user.studentId;

  try {
    const events = await studentModel.getRegisteredEvents(studentId);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch registered events" });
  }
};

exports.registerStudent = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if student already exists
    const existingStudent = await studentModel.findByEmail(email);
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student
    const newStudent = {
      name,
      email,
      password: hashedPassword,
    };

    // Insert student into the database
    const studentId = await studentModel.createStudent(newStudent);

    // You can send back a success response or a token here (optional)
    const token = jwt.sign({ id: studentId, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Student registered successfully",
      token, // You can send back the token if you want to authenticate users right after registration
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const student = await studentModel.findByEmail(email);
    console.log("Found student:", student);

    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ studentId: student.id }, JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllEventsForStudent = async (req, res) => {
  try {
    const events = await eventModel.fetchAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const student = await studentModel.getStudentById(req.user.studentId); // Fetch the profile by ID

    if (!student) {
      return res.status(404).json({ message: "Organizer not found" });
    }
    res.json({ name: student.name, email: student.email }); // Return name and email (or other details)
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const pool = require("../db");

// In your `studentController.js`
exports.checkRegistrationStatus = async (req, res) => {
  const studentId = req.user.studentId; // Assuming student ID is available via JWT
  const eventId = req.params.eventId;

  try {
    const [existingRegistration] = await pool.execute(
      "SELECT * FROM registrations WHERE student_id = ? AND event_id = ?",
      [studentId, eventId]
    );

    if (existingRegistration.length > 0) {
      return res.status(200).json({ isRegistered: true });
    }

    res.status(200).json({ isRegistered: false });
  } catch (err) {
    console.error("Error checking registration status:", err);
    res.status(500).json({
      message: "An error occurred while checking registration status.",
    });
  }
};

exports.getRegisteredStudents = async (req, res) => {
  const eventId = req.params.eventId;

  try {
    const [students] = await pool.execute(
      `SELECT s.name, s.email, r.registered_at
         FROM students s
         JOIN registrations r ON s.id = r.student_id
         WHERE r.event_id = ?`,
      [eventId]
    );

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching registered students:", err);
    res.status(500).json({
      message: "An error occurred while fetching registered students.",
    });
  }
};

exports.getFilteredEvents = async (req, res) => {
  try {
    const { category } = req.query;
    console.log("API hit: ", category);
    let query = category
      ? `SELECT e.*, c.name AS category_name
         FROM events e
         JOIN event_categories ec ON e.id = ec.event_id
         JOIN categories c ON ec.category_id = c.id
         WHERE c.id = ?
           AND (e.date > CURDATE() OR (e.date = CURDATE() AND e.time > CURTIME()))`
      : `SELECT e.*, c.name AS category_name
         FROM events e
         JOIN event_categories ec ON e.id = ec.event_id
         JOIN categories c ON ec.category_id = c.id
         WHERE (e.date > CURDATE() OR (e.date = CURDATE() AND e.time > CURTIME()))`;

    // Add the category to the params array if it's provided
    let params = category ? [category] : [];

    const [events] = await pool.execute(query, params);

    res.json(events); // Send back filtered (or unfiltered) events with category_name
  } catch (error) {
    console.error("Error fetching filtered events", error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

exports.unregisterEvent = async (req, res) => {
  const studentId = req.user.studentId;
  const { eventId } = req.params;

  try {
    await pool.execute(
      "DELETE FROM registrations WHERE student_id = ? AND event_id = ?",
      [studentId, eventId]
    );

    res.status(200).json({ message: "Unregistered successfully" });
  } catch (error) {
    console.error("Error unregistering from event:", error);
    res.status(500).json({ error: "Failed to unregister from event" });
  }
};

exports.getStudentProfile = async (req, res) => {
  try {
    // Get token from the Authorization header
    const token = req.headers.authorization.split(" ")[1]; // Get the token from 'Bearer token'

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token and get student ID from payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.id;

    // Fetch student details from the database
    const [student] = await pool.execute(
      "SELECT id, name, email, created_at FROM students WHERE id = ?",
      [studentId]
    );

    if (student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Return student profile data
    res.status(200).json(student[0]);
  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPastEvents = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    console.log(req.user);

    const [events] = await pool.execute(
      `
SELECT 
  e.id,
  e.title,
  e.description,
  e.date,
  e.time,
  c.name AS category,
  CASE 
    WHEN r.id IS NOT NULL THEN 1
    ELSE 0
  END AS is_registered
FROM events e
LEFT JOIN event_categories ec ON e.id = ec.event_id
LEFT JOIN categories c ON ec.category_id = c.id
LEFT JOIN registrations r ON e.id = r.event_id AND r.student_id = ?
WHERE (e.date < CURDATE()) 
   OR (e.date = CURDATE() AND e.time < CURTIME())
ORDER BY e.date DESC, e.time DESC;


`,
      [studentId]
    );
    console.log(events);

    res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching past events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReminders = async (req, res) => {
  const studentId = req.user.studentId; // assuming JWT sets `req.user`

  try {
    const [events] = await pool.execute(
      `SELECT 
         e.id, 
         e.title, 
         e.time, 
         e.location 
       FROM events e
       JOIN registrations r ON r.event_id = e.id
       WHERE r.student_id = ?
         AND TIMESTAMPDIFF(MINUTE, NOW(), CONCAT(e.date, ' ', e.time)) BETWEEN 0 AND 60
       ORDER BY e.date ASC, e.time ASC`,
      [studentId]
    );

    res.status(200).json({ events });
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
};
