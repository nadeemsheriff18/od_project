// components/AHODDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card'; // Assuming you have a Card component similar to the one used in the HOD page

function AHODDashboard() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('/api/ODController/ahod/fetchPending');
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching AHOD requests:', error);
            }
        };

        fetchRequests();
    }, []);

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

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center overflow-x-hidden">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-purple-700 mt-2">Pending OD Requests</h2>
            </div>
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
