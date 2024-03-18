const express = require('express');
const router = express.Router();

// View routes
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/add', (req, res) => {
  res.render('add_student');
});

router.get('/edit/:id', (req, res) => {
  // Fetch student by ID from the database and render the edit_student view
  const studentId = req.params.id;
  // Implement logic to fetch student details from the database
  const student = {}; // Placeholder for student fetched from the database
  res.render('edit_student', { student });
});

router.get('/delete/:id', (req, res) => {
  // Fetch student by ID from the database and render the delete_student view
  const studentId = req.params.id;
  // Implement logic to fetch student details from the database
  const student = {}; // Placeholder for student fetched from the database
  res.render('delete_student', { student });
});

module.exports = router;