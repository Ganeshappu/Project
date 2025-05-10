import React, { useEffect, useState } from "react";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch students from the database
    fetch('/api/students')  // Replace with your API endpoint
      .then(response => response.json())
      .then(data => setStudents(data));
  }, []);

  return (
    <div>
      <h2>Manage Students</h2>
      <p>Total Students: {students.length}</p>
      <ul>
        {students.map((student) => (
          <li key={student.id}>{student.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageStudents;
