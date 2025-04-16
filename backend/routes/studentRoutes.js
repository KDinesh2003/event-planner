const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  registerForEvent,
  cancelRegistration,
  getMyEvents,
  registerStudent,
  loginStudent,
  getAllEventsForStudent,
  getProfile,
  unregisterEvent,
  checkRegistrationStatus,
  getFilteredEvents,
  getStudentProfile,
  getPastEvents,
} = require("../controllers/studentController");

router.post("/cancel", auth, cancelRegistration);
router.get("/my-events", auth, getMyEvents);
router.post("/register-student", registerStudent);
router.post("/login-student", loginStudent);
router.get("/events", auth, getAllEventsForStudent);
router.get("/profile", auth, getProfile);
router.post("/register/:eventId", auth, registerForEvent);
router.get("/check-registration/:eventId", auth, checkRegistrationStatus);
router.get(
  "/events/filter",
  (req, res, next) => {
    console.log("Route is being hit"); 
    next(); // Pass control to the next middleware or route handler
  },
  auth,
  getFilteredEvents
);

router.delete("/unregister/:eventId", auth, unregisterEvent);
router.get("/profile", auth, getStudentProfile);
router.get("/past-events", auth, getPastEvents);


module.exports = router;
