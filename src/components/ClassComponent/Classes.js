import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import './Classes.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    rollNumber: '',
    name: '',
    age: '',
    section: '',
    studentClassName: '',
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewedClass, setViewedClass] = useState(false); // Track if a class has been viewed

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('classes/allclasses');
        setClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes. Please try again later.');
      }
    };

    fetchClasses();
  }, []);

  // Handle viewing students in a class
  const handleViewClass = async (className, section) => {
    setViewedClass(true); // Mark class as viewed
    try {
      const response = await axios.get(`students/class/${className}/${section}`);
      setStudents(response.data);
  
      if (response.data.length === 0) {
        setError('No students found in this class. You can add a student.');
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching class details:', err);
      setError('Failed to fetch class details. Please try again later.');
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`/students/deleteStudent/${id}`);
      setStudents(students.filter(student => student.id !== id));
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student. Please try again later.');
    }
  };

  // Handle student editing
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      rollNumber: student.rollNumber,
      name: student.name,
      age: student.age,
      section: student.section,
      studentClassName: student.studentClassName,
    });
  };

  // Save student edits
  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`/students/updateStudent/${editingStudent.id}`, newStudent);
      setStudents(students.map(student => (student.id === editingStudent.id ? response.data : student)));
      setEditingStudent(null);
      setNewStudent({ rollNumber: '', name: '', age: '', section: '', studentClassName: '' });
    } catch (err) {
      console.error('Error saving student:', err);
      setError('Failed to save student. Please try again later.');
    }
  };

  // Handle adding new student
  const handleAddStudent = async () => {
    try {
      const response = await axios.post('/students/addStudent', newStudent);
      setStudents([...students, response.data]);
      setNewStudent({ rollNumber: '', name: '', age: '', section: '', studentClassName: '' });
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Failed to add student. Please try again later.');
    }
  };

  return (
    <div className="classes-container">
      <h1>Class List</h1>
      <table>
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
                <button className="view" onClick={() => handleViewClass(classItem.name, classItem.section)}>View Students</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Only show the students table and "Add Student" form if a class has been viewed */}
      {viewedClass && students.length > 0 ? (
        <div>
          <h2>Students in Class</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Age</th>
                <th>Section</th>
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
                  <td>{student.section}</td>
                  <td>{student.studentClassName}</td>
                  <td>
                    <button className="edit" onClick={() => handleEditStudent(student)}>Edit</button>
                    <button className="delete" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        viewedClass && (
          <div>
            <h2>No Students Found</h2>
            <p>You can add a student to this class.</p>
          </div>
        )
      )}

      {/* Add/Edit student form */}
      <h3>{editingStudent ? 'Edit Student' : 'Add Student'}</h3>
      <form>
        <input
          type="text"
          placeholder="Roll Number"
          value={newStudent.rollNumber}
          onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
        />
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={newStudent.age}
          onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
        />
        <input
          type="text"
          placeholder="Section"
          value={newStudent.section}
          onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
        />
        <input
          type="text"
          placeholder="Class"
          value={newStudent.studentClassName}
          onChange={(e) => setNewStudent({ ...newStudent, studentClassName: e.target.value })}
        />
        {editingStudent === null ? (
          <button type="button" onClick={handleAddStudent}>Add Student</button>
        ) : (
          <button type="button" onClick={handleSaveEdit}>Save</button>
        )}
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Classes;
