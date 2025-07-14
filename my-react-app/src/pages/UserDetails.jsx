import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/firebase';

import { collection, getDocs } from 'firebase/firestore';
import { FaUserGraduate, FaEnvelope, FaIdCard, FaUserTag, FaCalendarAlt, FaSignInAlt, FaSpinner } from 'react-icons/fa';

const UserDetails = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const studentsRef = collection(db, 'students');
        const querySnapshot = await getDocs(studentsRef);

        const studentList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  // Function to get a random pastel color for cards
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 90%)`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800">Student Management Dashboard</h1>
          <span className="ml-4 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            {students.length} students
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
            <p className="text-gray-600">Loading student data...</p>
          </div>
        ) : students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                style={{ borderTop: `5px solid ${getRandomPastelColor()}` }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <FaUserGraduate className="text-indigo-600 text-xl" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">{student.name || "N/A"}</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-500 mr-3" />
                      <span className="text-gray-700">{student.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FaIdCard className="text-gray-500 mr-3" />
                      <span className="text-gray-700 font-mono text-sm">{student.uid}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUserTag className="text-gray-500 mr-3" />
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        student.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {student.role}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-500 mr-3" />
                      <span className="text-gray-700 text-sm">
                        {student.createdAt?.toDate
                          ? student.createdAt.toDate().toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaSignInAlt className="text-gray-500 mr-3" />
                      <span className="text-gray-700 text-sm">
                        {student.lastLogin?.toDate
                          ? student.lastLogin.toDate().toLocaleString()
                          : "Never logged in"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaUserGraduate className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No students found</h3>
            <p className="text-gray-500">There are currently no students registered in the system.</p>
            
          </div>
          
        )}
      </div>
    </div>
  );
};
        


export default UserDetails;