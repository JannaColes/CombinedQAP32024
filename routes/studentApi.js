const express = require('express');
const router = express.Router();
const dal = require('../dal/dal');

// API routes
router.get('/', async (req, res) => {
  try {
    const students = await dal.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const student = await dal.getStudentsById(id);
    if (!student) {
      res.status(404).send('Student not found');
    } else {
      res.json(student);
    }
  } catch (error) {
    console.error('Error retrieving student by ID: ', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, age, dob } = req.body;
    console.log("Received dob:", dob); // Log received dob value
    // Check if dob is empty or null
    if (!dob) {
      return res.status(400).json({ message: "Date of birth is required" });
    }
    // Validate date format
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format for date of birth" });
    }
    // Log dob value
    console.log("Date of birth:", dob);
    const newStudent = await dal.addStudent(name, email, age, dobDate);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error adding new student:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, age, dob } = req.body;
  try {
    // Check if dob is empty or null
    if (!dob) {
      return res.status(400).json({ message: "Date of birth is required" });
    }
    // Validate date format
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format for date of birth" });
    }
    // Log dob value
    console.log("Date of birth:", dob);
    const updatedStudent = await dal.updateStudent(id, name, email, age, dobDate);
    if (!updatedStudent) {
      res.status(404).send('Student not found');
    } else {
      res.json(updatedStudent);
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const deletedStudent = await dal.deleteStudent(id);
    if (!deletedStudent) {
      res.status(404).send('Student not found');
    } else {
      res.send(`Student with id ${id} deleted successfully`);
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
