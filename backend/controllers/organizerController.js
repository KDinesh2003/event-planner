const organizerModel = require("../models/organizerModel");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerOrganizer = async (req, res) => {
  const { name, email, password, organization } = req.body;

  if (!name || !email || !password || !organization) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await organizerModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Organizer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await organizerModel.createOrganizer({
      name,
      email,
      password: hashedPassword,
      organization,
    });

    const token = jwt.sign({ organizerId: id }, JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      organizer: { id, name, email, organization },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginOrganizer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const organizer = await organizerModel.findByEmail(email);
    console.log(organizer);

    if (!organizer || !(await bcrypt.compare(password, organizer.password))) {
      console.log("rip");

      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ organizerId: organizer.id }, JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      organizer: {
        id: organizer.id,
        name: organizer.name,
        email: organizer.email,
        organization: organizer.organization,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyEvents = async (req, res) => {
  const organizerId = req.user.organizerId;

  try {
    const events = await organizerModel.getEventsByOrganizer(organizerId);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching organizer events" });
  }
};

exports.getRegisteredStudents = async (req, res) => {
  const organizerId = req.user.id;
  const { eventId } = req.params;

  try {
    const event = await organizerModel.isEventOwnedByOrganizer(
      eventId,
      organizerId
    );
    if (!event) return res.status(403).json({ message: "Access denied" });

    const students = await organizerModel.getRegisteredStudentsForEvent(
      eventId
    );
    res.json({ event: event.title, students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching registered students" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const organizer = await organizerModel.getOrganizerById(
      req.user.organizerId
    ); // Fetch the profile by ID
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }
    res.json({ name: organizer.name, email: organizer.email }); // Return name and email (or other details)
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCategories = async (req, res) => {
    try {
      console.log("getCategories");
      
      let [categories] = await organizerModel.fetchCategories();
      console.log("Categories fetched from database:", categories);  // Log the categories
  
      // Ensure categories is returned as an array
      if (!Array.isArray(categories)) {
        categories = [categories]; // Wrap the result in an array if it's a single object
      }
  
      res.status(200).json(categories); // Send the categories to the frontend
    } catch (err) {
      console.error("Error fetching categories", err);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  };
  
// Create a new event (as before)
exports.createEvent = async (req, res) => {
  const { title, description, date, time, location, categories } = req.body;
  const organizerId = req.user.organizerId; // Assuming organizer is authenticated and user ID is in the request

  try {
    // Start a transaction
    await db.beginTransaction();

    // Insert into events table
    const [eventResult] = await db.execute(
      `INSERT INTO events (title, description, date, time, location, organizer_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, date, time, location, organizerId]
    );

    const eventId = eventResult.insertId;

    // Insert event categories (many-to-many relationship)
    for (const categoryId of categories) {
      await db.execute(
        `INSERT INTO event_categories (event_id, category_id) VALUES (?, ?)`,
        [eventId, categoryId]
      );
    }

    // Commit the transaction
    await db.commit();

    res.status(200).json({ message: "Event created successfully!" });
  } catch (err) {
    // Rollback if there's an error
    await db.rollback();
    console.error("Error creating event", err);
    res.status(500).json({ message: "Failed to create event" });
  }
};

const pool = require("../db")
exports.deleteEvent = async (req, res) => {
    const organizerId = req.user.organizerId;
    const { eventId } = req.params;
  
    try {
      // Optional: Ensure event belongs to this organizer
      const [result] = await pool.execute('SELECT * FROM events WHERE id = ? AND organizer_id = ?', [eventId, organizerId]);
      if (result.length === 0) {
        return res.status(403).json({ error: "Unauthorized to delete this event" });
      }
  
      await pool.execute('DELETE FROM registrations WHERE event_id = ?', [eventId]); // Clear registrations
      await pool.execute('DELETE FROM events WHERE id = ?', [eventId]); // Delete event 
  
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  };
  

  exports.getOrganizerProfile = async (req, res) => {
    try {
      const organizerId = req.user.organizerId; // Extract the organizerId from the JWT payload
  
      const [result] = await pool.execute(
        "SELECT name FROM organizers WHERE id = ?",
        [organizerId]
      );
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Organizer not found" });
      }
  
      res.status(200).json({ name: result[0].name });
    } catch (err) {
      console.error("Error fetching organizer profile:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Fetch full organizer details
  exports.getOrganizerDetails = async (req, res) => {
    try {
      const organizerId = req.user.organizerId; // Extract the organizerId from the JWT payload
  
      const [result] = await pool.execute(
        "SELECT id, name, email, organization_name, created_at FROM organizers WHERE id = ?",
        [organizerId]
      );
  
      if (result.length === 0) {
        return res.status(404).json({ message: "Organizer not found" });
      }
  
      res.status(200).json(result[0]); // Return the organizer details
    } catch (err) {
      console.error("Error fetching organizer details:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };