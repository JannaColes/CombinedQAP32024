const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'students',
  password: 'Charlie1986!',
  port: 5432,
});

const getAllStudents = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM students');
    return result.rows;
  } finally {
    client.release();
  }
};

const addStudent = async (student) => {
  const client = await pool.connect();
  try {
    const { name, email, age, dob } = student;
    const result = await client.query('INSERT INTO students (name, email, age, dob) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, age, dob]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const updateStudent = async (id, updatedStudent) => {
  const client = await pool.connect();
  try {
    const { name, email, age, dob } = updatedStudent;
    const result = await client.query('UPDATE students SET name = $1, email = $2, age = $3, dob = $4 WHERE id = $5 RETURNING *', [name, email, age, dob, id]);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const deleteStudent = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM students WHERE id = $1', [id]);
  } finally {
    client.release();
  }
};

module.exports = {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent
};