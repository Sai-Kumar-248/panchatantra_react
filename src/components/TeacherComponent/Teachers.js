import React, { useState, useEffect } from "react";
import axios from "axios";
import './Teacher.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    teacherName: "",
    teacherPhone: "",
    teacherEmail: "",
    subject: "",
  });
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Fetch all teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/teachers");
      setTeachers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load teachers. Please try again later.");
      console.error("Error fetching teachers:", err);
    }
  };

  // Handle add teacher
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const teacherToAdd = {
        teacherName: newTeacher.teacherName,
        teacherPhone: newTeacher.teacherPhone,
        teacherEmail: newTeacher.teacherEmail,
        subjects: [{ name: newTeacher.subject }],
      };

      const response = await axios.post(
        "http://localhost:8080/api/teachers/addTeacher",
        teacherToAdd
      );

      setTeachers([...teachers, response.data]);
      setNewTeacher({
        teacherName: "",
        teacherPhone: "",
        teacherEmail: "",
        subject: "",
      });
      setError(null);
    } catch (err) {
      setError("Failed to add teacher. Please try again.");
      console.error("Error adding teacher:", err);
    }
  };

  // Handle delete teacher
  const handleDeleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`http://localhost:8080/api/teachers/${teacherId}`);
      setTeachers(teachers.filter((teacher) => teacher.teacherId !== teacherId));
      setError(null);
    } catch (err) {
      setError("Failed to delete teacher. Please try again.");
      console.error("Error deleting teacher:", err);
    }
  };

  // Handle edit teacher
  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setNewTeacher({
      teacherName: teacher.teacherName,
      teacherPhone: teacher.teacherPhone,
      teacherEmail: teacher.teacherEmail,
      subject: teacher.subjects[0]?.name || "",
    });
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      const updatedTeacher = {
        teacherName: newTeacher.teacherName,
        teacherPhone: newTeacher.teacherPhone,
        teacherEmail: newTeacher.teacherEmail,
        subjects: [{ name: newTeacher.subject }],
      };

      await axios.put(
        `http://localhost:8080/api/teachers/updateTeacher/${editingTeacher.teacherId}`,
        updatedTeacher
      );

      setTeachers(
        teachers.map((teacher) =>
          teacher.teacherId === editingTeacher.teacherId
            ? { ...teacher, ...updatedTeacher }
            : teacher
        )
      );

      setEditingTeacher(null);
      setNewTeacher({
        teacherName: "",
        teacherPhone: "",
        teacherEmail: "",
        subject: "",
      });
      setError(null);
    } catch (err) {
      setError("Failed to update teacher. Please try again.");
      console.error("Error updating teacher:", err);
    }
  };

  return (
    <div className="teachers-container">
      <h1>Teachers List</h1>

      {/* Show Add Teacher form only if not editing */}
      {!editingTeacher && (
        <div className="add-teacher-form">
          <h2>Add Teacher</h2>
          <form onSubmit={handleAddTeacher}>
            <input
              type="text"
              name="teacherName"
              value={newTeacher.teacherName}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, teacherName: e.target.value })
              }
              placeholder="Teacher Name"
              required
            />
            <input
              type=" text"
              name="teacherPhone"
              value={newTeacher.teacherPhone}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, teacherPhone: e.target.value })
              }
              placeholder="Phone Number"
              required
            />
            <input
              type="email"
              name="teacherEmail"
              value={newTeacher.teacherEmail}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, teacherEmail: e.target.value })
              }
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="subject"
              value={newTeacher.subject}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, subject: e.target.value })
              }
              placeholder="Subject"
              required
            />
            <button type="submit">Add Teacher</button>
          </form>
        </div>
      )}

      {/* Display the teachers table */}
      {teachers.length > 0 && (
        <table className="teachers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Subjects</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.teacherId}>
                <td>{teacher.teacherId}</td>
                <td>{teacher.teacherName}</td>
                <td>{teacher.teacherPhone}</td>
                <td>{teacher.teacherEmail}</td>
                <td>{teacher.subjects.map((sub) => sub.name).join(", ")}</td>
                <td>
                  <button onClick={() => handleEditTeacher(teacher)}>Edit</button>
                  <button onClick={() => handleDeleteTeacher(teacher.teacherId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Teacher Form */}
      {editingTeacher && (
        <div className="edit-teacher-form">
          <h2>Edit Teacher</h2>
          <form onSubmit={handleUpdateTeacher}>
            <input
              type="text"
              name="teacherName"
              value={newTeacher.teacherName}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, teacherName: e.target.value })
              }
              placeholder="Teacher Name"
              required
            />
            <input
              type="text"
              name="teacherPhone"
              value={newTeacher.teacherPhone}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, teacherPhone: e.target.value })
              }
              placeholder="Phone Number"
              required
            />
            <input
              type="email"
              name="teacherEmail"
              value={newTeacher.teacherEmail}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, teacherEmail: e.target.value })
              }
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="subject"
              value={newTeacher.subject}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, subject: e.target.value })
              }
              placeholder="Subject"
              required
            />
            <button type="submit">Update Teacher</button>
            <button type="button" onClick={() => setEditingTeacher(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Teachers;