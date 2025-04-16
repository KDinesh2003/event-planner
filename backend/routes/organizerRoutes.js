const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  registerOrganizer,
  loginOrganizer,
  getMyEvents,
  getRegisteredStudents,
  getProfile,
  getCategories,
  deleteEvent,
  getOrganizerDetails,
  getOrganizerProfile
} = require("../controllers/organizerController");
const { createEvent } = require("../controllers/eventController");
const studentController = require("../controllers/studentController");

// New routes for registration and login
router.post("/register", registerOrganizer);
router.post("/login", loginOrganizer);

// Existing protected routes
router.get("/my-events", auth, getMyEvents);
router.get("/event/:eventId/registrations", auth, getRegisteredStudents);
router.get("/profile", auth, getProfile);
router.get("/categories", getCategories);

// Route to create an event
router.post(
  "/create-event",
  (req, res, next) => {
    console.log("🔶 Route is being hit!"); // Add this for testing
    next(); // Pass control to the next middleware or route handler
  },
  auth,
  createEvent
);

router.get(
  "/event/:eventId/students",
  auth,
  studentController.getRegisteredStudents
);
router.delete("/delete-event/:eventId", auth, deleteEvent);

// Fetch Organizer Profile
router.get(
  "/profile",
  auth,
  getOrganizerProfile
);

// Fetch Organizer Details
router.get(
  "/details",
  auth,
  getOrganizerDetails
);

module.exports = router;
