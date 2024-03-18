const express = require('express');
const router = express.Router();
const itemDal = require('../dal/studentDal');

// API routes
router.get('/students', async (req, res) => {
  try {
    const items = await itemDal.getAllStudents();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/students', async (req, res) => {
  try {
    const newStudent = await studentDal.addStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put('/students/:id', async (req, res) => {
  try {
    const updatedStudent = await studentDal.updateStudent(req.params.id, req.body);
    res.json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete('/students/:id', async (req, res) => {
  try {
    await studentDal.deleteStudent(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;