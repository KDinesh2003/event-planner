const express = require('express');
const router = express.Router();
const { registerStudent, registerOrganizer, login } = require('../controllers/authController');

router.post('/register/student', registerStudent);
router.post('/register/organizer', registerOrganizer);
router.post('/login', login);

module.exports = router;
