// components/AHODDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card'; // Assuming you have a Card component similar to the one used in the HOD page

function AHODDashboard() {
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('odRequest');
    const [subTab, setSubTab] = useState(1);
    const [subSections, setSubSections] = useState('A');

    const fetchRequests = async () => {
        try {
            const response = await axios.get('/api/ODController/ahod/fetchPending', {
                params: { year: subTab, section: subSections }, // Include year and section in the request
            });
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching AHOD requests:', error);
        }
    };

    useEffect(() => {
        fetchRequests(); // Fetch requests on component mount and when filters change
    }, [subTab, subSections]);

    const handleAccept = async (id, RegNo) => {
        try {
            await axios.patch('/api/ODController/ahod/updateStatus', { id, RegNo, status: 1 });
            setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleDecline = async (id, RegNo) => {
        try {
            await axios.patch('/api/ODController/ahod/updateStatus', { id, RegNo, status: 0 });
            setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
        } catch (error) {
            console.error('Error declining request:', error);
        }
    };

    // Function to change the selected year
    const handleSubTabChange = (year) => {
        setSubTab(year);
    };

    // Function to change the selected section
    const handleSubSectionChange = (section) => {
        setSubSections(section);
    };

    const Years = [1, 2, 3, 4];
    const yearSections = {
        1: ['A', 'B', 'C'],
        2: ['A', 'B'],
        3: ['A', 'B'],
        4: ['A'],
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center overflow-x-hidden">
            <h2 className="text-2xl font-semibold text-purple-700 mt-2">Pending OD Requests</h2>

            {/* Year Selection */}
            <div className="flex mt-4">
                {Years.map((year) => (
                    <button
                        key={year}
                        className={`py-2 px-4 text-lg font-medium ${subTab === year ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
                        onClick={() => handleSubTabChange(year)}
                    >
                        {year} Year
                    </button>
                ))}
            </div>

            {/* Section Selection */}
            <div className="flex mt-2">
                {yearSections[subTab].map((section) => (
                    <button
                        key={section}
                        className={`py-2 px-4 text-lg font-medium ${subSections === section ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
                        onClick={() => handleSubSectionChange(section)}
                    >
                        {section}
                    </button>
                ))}
            </div>

            {/* Display Requests */}
            <div className="mt-4 flex flex-col items-center w-full max-w-4xl">
                {requests.length === 0 ? (
                    <p>No requests pending approval</p>
                ) : (
                    requests.map(request => (
                        <Card
                            key={request.id}
                            data={request}
                            onAccept={() => handleAccept(request.id, request.RegNo)}
                            onDecline={() => handleDecline(request.id, request.RegNo)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default AHODDashboard;
