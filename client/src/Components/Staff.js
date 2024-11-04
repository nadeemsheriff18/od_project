// In CurrentODPermission.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Staff= ()=>{
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCurrentODPermission = async () => {
      try {
        const response = await axios.get('/api/ODController/currentODPermission');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching current OD/Permission data:', error);
      }
    };

    fetchCurrentODPermission();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center overflow-x-hidden">
      <h2 className="text-2xl font-semibold text-purple-700 mt-2">Current OD/Permission Students</h2>
      <div className="w-full max-w-4xl mt-4">
        {students.length === 0 ? (
          <p className="text-gray-600">No students currently on OD/Permission.</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-100">
                  <th className="py-2 px-4 border-b-2 border-gray-300">Register Number</th>
                  <th className="py-2 px-4 border-b-2 border-gray-300">Reason</th>
                  
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b border-gray-300">{student.RegNo}</td>
                    <td className="py-2 px-4 border-b border-gray-300">{student.Reason}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Staff;
