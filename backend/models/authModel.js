// const pool = require('../db');

// // Reusable: Find user by email from a role-specific table
// exports.findUserByEmail = async (email, role) => {
//   const table = role === 'student' ? 'students' : 'organizers';
//   const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);
//   return rows[0];
// };

// // Get user ID by email (used after insert)
// exports.getUserIdByEmail = async (email, role) => {
//   const table = role === 'student' ? 'students' : 'organizers';
//   const [rows] = await pool.execute(`SELECT id FROM ${table} WHERE email = ?`, [email]);
//   return rows[0];
// };
