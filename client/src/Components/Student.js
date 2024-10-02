import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Student = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const [requestType, setRequestType] = useState('on-duty');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [subject, setSubject] = useState('');
    const [cookies] = useCookies(['Email', 'AuthToken']);
    const [studentData, setStudentData] = useState(null); // Access the cookies you set earlier

    const MAX_CHARACTERS = 90; // Adjust the limit as needed

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                console.log(`Fetching data from URL: /api/Student/${cookies.Email}`);
                const response = await axios.get(`/api/Student/${cookies.Email}`);
                console.log('Response:', response.data);
                if (response.status === 200) {
                    setStudentData(response.data);
                } else {
                    console.error('Failed to fetch student data');
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        if (cookies.Email) {
            fetchStudentData();
        }
    }, [cookies.Email]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (subject.length > MAX_CHARACTERS) {
            alert(`The subject cannot exceed ${MAX_CHARACTERS} characters.`);
            return;
        }

        const formData = {
            RegNo: studentData.rollno,
            requestType,
            startDate,
            endDate,
            reason,
            subject,
            formattedDate,
        };

        console.log(formData);

        try {
            const response = await axios.post('/api/Student/submitOD', formData);

            if (response.status === 200) {
                alert('Request submitted successfully');
                // Reset form or handle success
                setRequestType('on-duty');
                setStartDate('');
                setEndDate('');
                setReason('');
                setSubject(''); // Reset subject field
            } else {
                alert('Failed to submit request');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the request');
        }
    };

    return (
        <>

            <div className="w-full min-h-screen bg-violet-100 pt-24">
                <div className="flex justify-evenly items-center pt-7 px-24">
                    <div>

                        OD :
                        {/* <img 
                            src="./assets/download.png" 
                            alt="Profile of Kavinraj" 
                            className="w-[70%] h-[60%] rounded-3xl opacity-0" 
                        /> */}
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-xl font-sans text-lg text-gray-700">
                        <div className="flex flex-wrap mb-2">
                            <p className="w-32 font-normal mr-4 text-purple-800">
                                <strong>Name:</strong>
                            </p>
                            <p className="flex-1 break-words text-gray-600">
                                {studentData?.stud_name || 'Loading...'}
                            </p>
                        </div>
                        <div className="flex flex-wrap mb-2">
                            <p className="w-32 font-normal mr-4 text-purple-800">
                                <strong>Roll number:</strong>
                            </p>
                            <p className="flex-1 break-words text-gray-600">
                                {studentData?.rollno || 'Loading...'}
                            </p>
                        </div>
                        <div className="flex flex-wrap mb-2">
                            <p className="w-32 font-normal mr-4 text-purple-800">
                                <strong>Department:</strong>
                            </p>
                            <p className="flex-1 break-words text-gray-600">
                                {studentData?.department || 'Loading...'}
                            </p>
                        </div>
                        <div className="flex flex-wrap mb-2">
                            <p className="w-32 font-normal mr-4 text-purple-800">
                                <strong>Year:</strong>
                            </p>
                            <p className="flex-1 break-words text-gray-600">
                                {studentData?.year || 'Loading...'}
                            </p>
                        </div>
                        <div className="flex flex-wrap mb-2">
                            <p className="w-32 font-normal mr-4 text-purple-800">
                                <strong>Semester:</strong>
                            </p>
                            <p className="flex-1 break-words text-gray-600">
                                {studentData?.sem || 'Loading...'}
                            </p>
                        </div>
                    </div>


                    <div>

                        <div>
                            OD :

                        </div>
                        <div>

                            Attendance:
                        </div>

                    </div>
                </div>
                <div className="flex flex-col bg-[#fcfafc] mt-9 mx-16 rounded-xl mb-9 shadow-2xl">
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-evenly items-center py-3 px-10">
                            <button type="button" className="bg-violet-100 rounded-xl p-2">OD request</button>
                            {/* <button type="button">Attendance</button> */}
                            <Link to="/history">
                                <button type="button">History</button>
                            </Link>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex justify-evenly items-center py-3 px-10">
                                <div className="flex flex-col">
                                    <label htmlFor="requestType">Request type</label>
                                    <select
                                        name="requestType"
                                        id="requestType"
                                        value={requestType}
                                        onChange={(e) => setRequestType(e.target.value)}
                                    >
                                        <option value="on-duty">On-Duty</option>
                                        <option value="permission">Permission</option>
                                        <option value="leave">Leave</option>
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="startDate">Start date</label>
                                    <input
                                        requiredw
                                        type="date"
                                        name="startDate"
                                        id="startDate"
                                        value={startDate}
                                        min={formattedDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                {console.log(startDate , formattedDate )}
                                <div className="flex flex-col">
                                    <label htmlFor="endDate">End date</label>
                                    <input
                                        required
                                        type="date"
                                        name="endDate"
                                        id="endDate"
                                        value={endDate}
                                        min={startDate}
                                        
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center py-2 gap-4">
                                <label htmlFor="subject">Subject:</label>
                                <p>{MAX_CHARACTERS - subject.length} characters remaining</p>
                                <textarea
                                    required
                                    id="subject"
                                    className="w-[50%] border-2 p-2"
                                    placeholder="Subject of the OD / permission"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    maxLength={MAX_CHARACTERS}  // Add maxLength attribute
                                />

                                <label htmlFor="reason">Reason:</label>
                                <textarea
                                    required
                                    id="reason"
                                    className="w-[50%] border-2 p-2"
                                    placeholder="Reason for requesting on-duty"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="bg-violet-100 rounded-xl p-1"
                                    disabled={subject.length > MAX_CHARACTERS}
                                >
                                    Send Request
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Student;
