// src/Components/ReportPage.js

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const ReportPage = () => {
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');

  const fetchReportData = async () => {
    const response = await axios.get('/api/ODController/report', {
      params: { year, section }
    });
    return response.data;
  };

  const { data: reportData = [], isLoading } = useQuery({
    queryKey: ['reportData', year, section], // Updated to object form
    queryFn: fetchReportData,
    enabled: !!year && !!section // only fetch when both year and section are selected
  });

  const handleGenerateReport = () => {
    // This will trigger the fetch
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-purple-700 mt-2">Generate OD Report</h2>
      <div className="mt-4">
        <select value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border rounded">
          <option value="">Select Year</option>
          <option value="1">1 Year</option>
          <option value="2">2 Year</option>
          <option value="3">3 Year</option>
          <option value="4">4 Year</option>
        </select>
        <select value={section} onChange={(e) => setSection(e.target.value)} className="p-2 border rounded ml-4">
          <option value="">Select Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
          
        </select>
        <button onClick={handleGenerateReport} className="ml-4 bg-purple-500 text-white px-4 py-2 rounded">
          Generate Report
        </button>
      </div>

      {isLoading ? (
        <p>Loading report data...</p>
      ) : (
        <table className="mt-6 min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Roll Number</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">OD Count</th>
              <th className="border border-gray-300 p-2">Permission Count</th>
            </tr>
          </thead>
          <tbody>
          
{reportData.map((student) => (
  <tr key={student.RollNumber}>
    <td className="border border-gray-300 p-2">{student.RollNumber}</td>
    <td className="border border-gray-300 p-2">{student.Name}</td>
    <td className="border border-gray-300 p-2">{student.OD}</td>
    <td className="border border-gray-300 p-2">{student.Permission}</td>
  </tr>
))}

          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportPage;
