const { Pool } = require('pg');
const moment = require('moment');

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
  } catch (error) {
    console.error('Error fetching all students:', error);
  } finally {
    client.release();
  }
};

const addStudent = async (name, email, age, dob) => {
  const client = await pool.connect();
  try {
    // Check if dob is provided and is a valid date string
    if (!dob) {
      throw new Error('Date of birth is required');
    }

    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      throw new Error('Invalid date of birth');
    }

    // Format dob as YYYY-MM-DD
    const formattedDob = dobDate.toISOString().split('T')[0];

    const result = await client.query('INSERT INTO students (name, email, age, dob) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, age, formattedDob]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  } finally {
    client.release();
  }
};


const updateStudent = async (id, name, email, age, dob) => {
  const client = await pool.connect();
  try {
    const updateFields = [];
    const values = [];

    if (name) {
      updateFields.push('name = $1');
      values.push(name);
    }
    if (email) {
      updateFields.push('email = $2');
      values.push(email);
    }
    if (age) {
      updateFields.push('age = $3');
      values.push(age);
    }
    if (dob) {
      const dobDate = new Date(dob);
      if (isNaN(dobDate.getTime())) {
        throw new Error('Invalid date of birth');
      }
      const formattedDob = dobDate.toISOString().split('T')[0];
      updateFields.push('dob = $4');
      values.push(formattedDob);
    }

    values.push(id);

    const query = `UPDATE students SET ${updateFields.join(', ')} WHERE id = $${values.length} RETURNING *`;
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
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
