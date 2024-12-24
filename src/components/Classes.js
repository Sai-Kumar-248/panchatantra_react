import React, { useEffect, useState } from 'react';
import axios from '../axiosInstance';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]); // Store students of a class
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    rollNumber: '',
    name: '',
    age: '',
    grade: '',
    studentClassName: '',
  });

  const [editingStudent, setEditingStudent] = useState(null); // Track the student being edited

  // Fetch all classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('classes/allclasses'); // Replace with your backend endpoint for classes
        setClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
      }
    };

    fetchClasses();
  }, []);

  // Fetch students of the specific class and section
  const handleViewClass = async (className, section) => {
    try {
      const response = await axios.get(`students/class/${className}/${section}`); // Call backend endpoint
      setStudents(response.data); // Update students state with the response
    } catch (err) {
      console.error('Error fetching class details:', err);
      setError('Failed to fetch class details. Please try again later.');
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`/students/deleteStudent/${id}`);
      setStudents(students.filter(student => student.id !== id)); // Remove the deleted student from state
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student. Please try again later.');
    }
  };

  // Handle student editing
  const handleEditStudent = (student) => {
    setEditingStudent(student); // Set the student being edited
    setNewStudent({
      rollNumber: student.rollNumber,
      name: student.name,
      age: student.age,
      grade: student.grade,
      studentClassName: student.studentClassName,
    });
  };

  // Save edited student information
  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`/students/updateStudent/${editingStudent.id}`, newStudent);
      setStudents(students.map(student => (student.id === editingStudent.id ? response.data : student)));
      setEditingStudent(null); // Reset editing mode
      setNewStudent({ rollNumber: '', name: '', age: '', grade: '', studentClassName: '' }); // Reset form
    } catch (err) {
      console.error('Error saving student:', err);
      setError('Failed to save student. Please try again later.');
    }
  };

  // Handle adding new student
  const handleAddStudent = async () => {
    try {
      const response = await axios.post('/students/addStudent', newStudent);
      setStudents([...students, response.data]); // Add the newly added student to the list
      setNewStudent({ rollNumber: '', name: '', age: '', grade: '', studentClassName: '' }); // Reset form
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Failed to add student. Please try again later.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Class List</h1>
      <table border="1" style={{ margin: '0 auto', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Class Name</th>
            <th>Section</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td>{classItem.id}</td>
              <td>{classItem.name}</td>
              <td>{classItem.section}</td>
              <td>
                <button onClick={() => handleViewClass(classItem.name, classItem.section)}>View Students</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {students.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Students in Class</h2>
          <table border="1" style={{ margin: '0 auto', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Age</th>
                <th>Grade</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.grade}</td>
                  <td>{student.studentClassName}</td>
                  <td>
                    <button onClick={() => handleEditStudent(student)}>Edit</button>
                    <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add student form */}
          <h3>{editingStudent ? 'Edit Student' : 'Add Student'}</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ width: '300px' }}>
              <input
                type="text"
                placeholder="Roll Number"
                value={newStudent.rollNumber}
                onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                disabled={editingStudent !== null} // Disable if editing
              />
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                disabled={editingStudent !== null} // Disable if editing
              />
              <input
                type="number"
                placeholder="Age"
                value={newStudent.age}
                onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                disabled={editingStudent !== null} // Disable if editing
              />
              <input
                type="text"
                placeholder="Grade"
                value={newStudent.grade}
                onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                disabled={editingStudent !== null} // Disable if editing
              />
              <input
                type="text"
                placeholder="Class"
                value={newStudent.studentClassName}
                onChange={(e) => setNewStudent({ ...newStudent, studentClassName: e.target.value })}
                disabled={editingStudent !== null} // Disable if editing
              />
              {editingStudent === null ? (
                <button onClick={handleAddStudent}>Add Student</button>
              ) : (
                <button onClick={handleSaveEdit}>Save</button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
    </div>
  );
};

export default Classes;
