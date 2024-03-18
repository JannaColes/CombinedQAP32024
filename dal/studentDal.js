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
  } catch (error) {
    console.error('Error fetching all students:', error);
  } finally {
    client.release();
  }
};

const addStudent = async (name, email, age, dob) => {
  const client = await pool.connect();
  try {
    const result = await client.query('INSERT INTO students (name, email, age, dob) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, age, dob]);
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
    const result = await client.query('UPDATE students SET name = $1, email = $2, age = $3, dob = $4 WHERE id = $5 RETURNING *', [name, email, age, dob, id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;  
  } finally {
    client.release();
  }
};

const patchStudent = async (id, updatedFields) => {
  const client = await pool.connect();
  try {
    let updateQuery = 'UPDATE students SET ';
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(updatedFields)) {
      updateQuery += `${key} = $${index}, `;
      values.push(value);
      index++;
    }
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = $${index} RETURNING *`;
    values.push(id);
    const result = await client.query(updateQuery, values);
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
  patchStudent,
  deleteStudent
};