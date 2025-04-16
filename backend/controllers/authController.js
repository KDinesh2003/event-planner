// const bcrypt = require('bcrypt');
// const pool = require('../db');
// const generateToken = require('../utils/generateToken');

// exports.registerStudent = async (req, res) => {
//   const { name, email, password } = req.body;
//   const hashed = await bcrypt.hash(password, 10);

//   const [existing] = await pool.execute('SELECT id FROM students WHERE email = ?', [email]);
//   if (existing.length) return res.status(400).json({ message: 'Student already exists' });

//   await pool.execute('INSERT INTO students (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
//   const [[student]] = await pool.execute('SELECT id FROM students WHERE email = ?', [email]);

//   const token = generateToken(student.id, 'student');
//   res.json({ token });
// };

// exports.registerOrganizer = async (req, res) => {
//   const { name, email, password, organization_name } = req.body;
//   const hashed = await bcrypt.hash(password, 10);

//   const [existing] = await pool.execute('SELECT id FROM organizers WHERE email = ?', [email]);
//   if (existing.length) return res.status(400).json({ message: 'Organizer already exists' });

//   await pool.execute(
//     'INSERT INTO organizers (name, email, password, organization_name) VALUES (?, ?, ?, ?)',
//     [name, email, hashed, organization_name]
//   );
//   const [[organizer]] = await pool.execute('SELECT id FROM organizers WHERE email = ?', [email]);

//   const token = generateToken(organizer.id, 'organizer');
//   res.json({ token });
// };

// exports.login = async (req, res) => {
//   const { email, password, role } = req.body;
//   const table = role === 'student' ? 'students' : 'organizers';

//   const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);
//   if (!rows.length) return res.status(404).json({ message: 'User not found' });

//   const user = rows[0];
//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.status(401).json({ message: 'Invalid credentials' });

//   const token = generateToken(user.id, role);
//   res.json({ token });
// };
