const express = require('express');
const router = express.Router();
const dal = require('../dal/dal');
const moment = require('moment');

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
    const newStudent = await dal.addStudent(name, email, age, dob);
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
    // Check if dob is provided and valid
    if (dob === undefined || dob === null || dob.trim() === '') {
      // If dob is not provided, set it to null or an empty string
      req.body.dob = null; // Set dob to null
      // req.body.dob = ''; // Alternatively, set dob to an empty string

      // Call updateStudent function with provided data
      const updatedStudent = await dal.updateStudent(id, name, email, age, req.body.dob);
      if (!updatedStudent) {
        res.status(404).send('Student not found');
      } else {
        res.json(updatedStudent);
      }
    } else {
      // Call updateStudent function with provided data
      const updatedStudent = await dal.updateStudent(id, name, email, age, dob);
      if (!updatedStudent) {
        res.status(404).send('Student not found');
      } else {
        res.json(updatedStudent);
      }
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
