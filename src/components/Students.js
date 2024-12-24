import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';  // Import the Axios instance

const Students = () => {
  const [students, setStudents] = useState([]); // Default state is an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newStudent, setNewStudent] = useState({
    rollNumber: '',
    name: '',
    age: '',
    studentClassName: '',
  });

  const [updateStudent, setUpdateStudent] = useState(null); // State for the student to be updated
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get('/students');
        setStudents(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        setError('Failed to load students. Please try again later.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newStudent.rollNumber || !newStudent.name || !newStudent.age || !newStudent.studentClassName) {
      setFormError('All fields are required!');
      return;
    }

    try {
      const response = await axiosInstance.post('/students/addStudent', newStudent);
      setStudents((prevStudents) => [...prevStudents, response.data]);
      setNewStudent({
        rollNumber: '',
        name: '',
        age: '',
        studentClassName: '',
      });
      setFormError(null);
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Failed to add student. Please try again later.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/students/deleteStudent/${id}`);
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Failed to delete student. Please try again later.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!updateStudent.rollNumber || !updateStudent.name || !updateStudent.age || !updateStudent.studentClassName) {
      setFormError('All fields are required!');
      return;
    }

    try {
      const response = await axiosInstance.put(`/students/updateStudent/${updateStudent.id}`, updateStudent);
      setStudents((prevStudents) => prevStudents.map((student) =>
        student.id === updateStudent.id ? response.data : student
      ));
      setUpdateStudent(null); // Close the form after updating
      setFormError(null);
    } catch (err) {
      console.error('Error updating student:', err);
      setError('Failed to update student. Please try again later.');
    }
  };

  const handleEdit = (student) => {
    setUpdateStudent(student);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Students List</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Roll Number</th>
            <th>Name</th>
            <th>Age</th>
            <th>Class</th>
            <th>Actions</th> {/* Column for actions */}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.rollNumber}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.studentClassName}</td>
              <td>
                {/* Update button beside each student */}
                <button onClick={() => handleEdit(student)}>Edit</button>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Student Form */}
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        {formError && <div style={{ color: 'red' }}>{formError}</div>}
        <div>
          <label>
            Roll Number:
            <input
              type="text"
              name="rollNumber"
              value={newStudent.rollNumber}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newStudent.name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={newStudent.age}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        {/* <div>
          <label>
            Grade:
            <input
              type="text"
              name="grade"
              value={newStudent.grade}
              onChange={handleChange}
              required
            />
          </label>
        </div> */}
        <div>
          <label>
            Class:
            <input
              type="text"
              name="studentClassName"
              value={newStudent.studentClassName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Add Student</button>
      </form>

      {/* Update Student Form */}
      {updateStudent && (
        <div>
          <h2>Update Student</h2>
          <form onSubmit={handleUpdate}>
            {formError && <div style={{ color: 'red' }}>{formError}</div>}
            <div>
              <label>
                Roll Number:
                <input
                  type="text"
                  name="rollNumber"
                  value={updateStudent.rollNumber}
                  onChange={handleUpdateChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={updateStudent.name}
                  onChange={handleUpdateChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Age:
                <input
                  type="number"
                  name="age"
                  value={updateStudent.age}
                  onChange={handleUpdateChange}
                  required
                />
              </label>
            </div>
            {/* <div>
              <label>
                Grade:
                <input
                  type="text"
                  name="grade"
                  value={updateStudent.grade}
                  onChange={handleUpdateChange}
                  required
                />
              </label>
            </div> */}
            <div>
              <label>
                Class:
                <input
                  type="text"
                  name="studentClassName"
                  value={updateStudent.studentClassName}
                  onChange={handleUpdateChange}
                  required
                />
              </label>
            </div>
            <button type="submit">Update Student</button>
            <button type="button" onClick={() => setUpdateStudent(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Students;
