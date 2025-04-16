const eventModel = require("../models/eventModel");
exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.fetchAllEvents();

    // Add categories to each event
    const eventsWithCategories = await Promise.all(
      events.map(async (event) => {
        const categories = await eventModel.getEventCategories(event.id);
        return { ...event, categories };
      })
    );

    res.json(eventsWithCategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await eventModel.fetchEventById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const categories = await eventModel.getEventCategories(id);
    const registrationCount = await eventModel.getEventRegistrationCount(id);

    res.json({
      ...event,
      categories,
      registrationCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch event details" });
  }
};

exports.createEvent = async (req, res) => {
    console.log("✅ create-event route hit");
    console.log("User info:", req.user);
  
    if (!req.user || !req.user.organizerId) {
      return res.status(400).json({ message: "User ID is missing in the token" });
    }
  
    const { title, description, date,time, location, categories } = req.body;
    const organizerId = req.user.organizerId;
  
    // 🕒 Get current time in "HH:MM" format
    // const now = new Date();
    // const time = now.toTimeString().split(":").slice(0, 2).join(":"); // e.g., "14:30"
  
    try {
      const eventId = await eventModel.insertEvent({
        title,
        description,
        date,
        time, // ⬅️ use current time here
        location,
        organizerId,
      });
  
      await eventModel.insertEventCategories(eventId, categories);
  
      res.status(200).json({ message: "Event created successfully!" });
    } catch (err) {
      console.error("Error creating event:", err);
      res.status(500).json({ message: "Failed to create event" });
    }
  };
  
const pool = require("../db")

exports.searchEvents = async (req, res) => {
    console.log("🔍 /search route hit!");
  
    const { keyword } = req.query;
    
    try {
      let query;
      let queryParams = [];
  
      // If no keyword is provided, return all events
      if (keyword) {
        query = `
          SELECT e.*, c.name AS category_name
          FROM events e
          JOIN event_categories ec ON e.id = ec.event_id
          JOIN categories c ON ec.category_id = c.id
          WHERE e.title LIKE ? OR e.description LIKE ?`;
        queryParams = [`%${keyword}%`, `%${keyword}%`];
      } else {
        // If no keyword, return all events
        query = `
          SELECT e.*, c.name AS category_name
          FROM events e
          JOIN event_categories ec ON e.id = ec.event_id
          JOIN categories c ON ec.category_id = c.id`;
      }
  
      const [events] = await pool.execute(query, queryParams);
      res.json(events);
    } catch (error) {
      console.error("Error searching events", error);
      res.status(500).json({ message: "Error fetching events" });
    }
  };
  