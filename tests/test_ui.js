
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('UI Tests', () => {
  it('Displays list of students on the homepage', () => {
    const studentList = document.getElementById('student-list');
    expect(studentList).not.toBeNull();
    expect(studentList.children.length).toBeGreaterThan(0);
  });

  it('Adds a new student through the UI', async () => {
    // Simulate clicking the add button
    const addButton = document.getElementById('add-button');
    addButton.click();

    // Simulate filling out the form
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const gradeInput = document.getElementById('grade');
    nameInput.value = 'New Student';
    ageInput.value = '21';
    gradeInput.value = 'B';

    // Simulate submitting the form
    const submitButton = document.getElementById('submit-button');
    submitButton.click();

    // Wait for the UI to update (you might need to adjust the timing here)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify that the new student appears in the list
    const studentList = document.getElementById('student-list');
    expect(studentList.children.length).toBeGreaterThan(0);
    const lastStudent = studentList.children[studentList.children.length - 1];
    expect(lastStudent.textContent).toContain('New Student');
  });

  it('Updates a student through the UI', async () => {
    // Simulate clicking the edit button of the first student
    const firstStudentEditButton = document.querySelector('.edit-button');
    firstStudentEditButton.click();

    // Simulate updating the details in the edit form
    const updatedNameInput = document.getElementById('name');
    const updatedAgeInput = document.getElementById('age');
    const updatedGradeInput = document.getElementById('grade');
    updatedNameInput.value = 'Updated Student';
    updatedAgeInput.value = '22';
    updatedGradeInput.value = 'A';

    // Simulate submitting the form
    const submitButton = document.getElementById('submit-button');
    submitButton.click();

    // Wait for the UI to update (you might need to adjust the timing here)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify that the updated student details appear in the list
    const studentList = document.getElementById('student-list');
    const firstStudent = studentList.children[0];
    expect(firstStudent.textContent).toContain('Updated Student');
  });

  it('Deletes a student through the UI', async () => {
    // Simulate clicking the delete button of the first student
    const firstStudentDeleteButton = document.querySelector('.delete-button');
    firstStudentDeleteButton.click();

    // Wait for the confirmation modal to appear
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate confirming the deletion
    const confirmDeleteButton = document.getElementById('confirm-delete-button');
    confirmDeleteButton.click();

    // Wait for the UI to update (you might need to adjust the timing here)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify that the first student has been removed from the list
    const studentList = document.getElementById('student-list');
    expect(studentList.children.length).toBe(0);
  });
});
