const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createEvent, getAllEvents, getEventById, searchEvents } = require('../controllers/eventController');

router.get('/', getAllEvents);
router.get('/search',auth, searchEvents);
router.get('/:id', getEventById);
router.post('/', auth, createEvent); 

module.exports = router;
