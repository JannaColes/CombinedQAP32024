const express = require('express');
const methodOverride = require('method-override');
const { Pool } = require('pg');
const router = express.Router();
const studentsRouter = require('./routes/studentRoutes');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// MiddleWare
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(bodyParser.json());

// Create a pool for connecting to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'students',
  password: 'Charlie1986!',
  port: 5432,
});

// Routes
app.use('/students', studentsRouter);

app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students');
    rows.forEach(student => {
      const dob = new Date(student.dob).toLocaleDateString();
      student.dob = dob;
    });
    res.render('index', { students: rows });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/students', async (req, res) => {
  const { name, email, age, dob } = req.body;
  try {
    await pool.query('INSERT INTO students (name, email, age, dob) VALUES ($1, $2, $3, $4)', [name, email, age, dob]);
    res.redirect('/');
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/students/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/students/:id/edit', async (req, res) => {
  const id = req.params.id;
  try {
    const { rows } = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    if (rows.length === 0) {
      res.status(404).send('Student not found');
    } else {
      res.render('edit', { student: rows[0] });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/students/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, age, dob } = req.body;
  try {
    const result = await pool.query('UPDATE students SET name = $1, email = $2, age = $3, dob = $4 WHERE id = $5', [name, email, age, dob, id]);
    res.redirect('/');
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;