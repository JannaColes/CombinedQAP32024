const request = require('supertest');
const app = require('../index');

describe('Student API', () => {
  it('GET /students should return list of students', async () => {
    const response = await request(app).get('/students');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5); // Adjust the expected length according to your test data
  });

  it('POST /students should add a new student', async () => {
    const newStudent = {
      name: 'Test Student',
      email: 'test@example.com',
      age: 25,
      dob: '1997-05-15'
    };

    const response = await request(app)
      .post('/students')
      .send(newStudent);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Student');
    expect(response.body.email).toBe('test@example.com');
    // Add more assertions for other properties as needed
  });

  it('PUT /students/:id should update a student', async () => {
    const updatedStudentData = {
      name: 'Updated Name',
      age: 30
      // Add other properties you want to update
    };

    const response = await request(app)
      .put('/students/1') // Adjust the ID according to your test data
      .send(updatedStudentData);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Name');
    expect(response.body.age).toBe(30);
    // Add more assertions for other properties as needed
  });

  it('DELETE /students/:id should delete a student', async () => {
    const response = await request(app).delete('/students/1'); // Adjust the ID according to your test data
    expect(response.status).toBe(200);
    expect(response.text).toBe('Student with id 1 deleted successfully');
  });
});
