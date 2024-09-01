import React, { useState } from 'react';
import Odheader from './Odheader';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    const [subject , setSubject ]= useState('');
    const RegNo = 221401050;
    const date = new Date();
    const today = date.toLocaleDateString();

    const MAX_CHARACTERS = 90; // Adjust the limit as needed

const handleSubmit = async (event) => {
    event.preventDefault();

    if (subject.length > MAX_CHARACTERS) {
        alert(`The subject cannot exceed ${MAX_CHARACTERS} characters.`);
        return;
    }

    const formData = {
        requestType,
        startDate,
        endDate,
        reason,
        RegNo,
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
            // Handle failure
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the request');
    }
};

return (
    <>
        <Odheader />
        <div className="w-full min-h-screen bg-violet-100 pt-24">
            <div className="flex justify-evenly items-center pt-7 px-24">
                <div className="">
                    <img 
                        src="./assets/download.png" 
                        alt="Profile of Kavinraj" 
                        className="w-[70%] h-[60%] rounded-3xl" 
                    />
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-[#fcfafc] p-4 font-sans text-xl">
                    <p>Name: Kavinraj</p>
                    <p>Roll number: {RegNo}</p>
                    <p>Department: Computer Science and Business Systems</p>
                    <p>Year: 3</p>
                    <p>Semester: 5</p>
                </div>
                <div>
                    Attendance
                </div>
            </div>
            <div className="flex flex-col bg-[#fcfafc] mt-9 mx-16 rounded-xl">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-evenly items-center py-3 px-10">
                        <button type="button" className="bg-violet-100 rounded-xl p-2">OD request</button>
                        <button type="button">Attendance</button>
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
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="startDate">Start date</label>
                                <input 
                                required
                                    type="date" 
                                    name="startDate" 
                                    id="startDate" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
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
                            r
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
