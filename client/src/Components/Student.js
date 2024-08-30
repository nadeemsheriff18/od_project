import React from 'react';
import Odheader from './Odheader';
import { Link } from 'react-router-dom';

const Student = () => {
    const date = new Date();
    const today = date.toLocaleDateString();

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
                        <p>Roll number: 221401035</p>
                        <p>Department: Computer Science and Business Systems</p>
                        <p>Year: 3</p>
                        <p>Semester: 5</p>
                    </div>
                    <div>
                        Attendance
                    </div>
                </div>
                <div className="flex flex-col bg-[#fcfafc] mt-9 mx-16 rounded-xl">
                    <div className="flex justify-evenly items-center py-3 px-10">
                        <button className="bg-violet-100 rounded-xl p-2">OD request</button>
                        <button>Attendance</button>
                        <Link to="/history">
                            <button>History</button>
                        </Link>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-evenly items-center py-3 px-10">
                            <div className="flex flex-col">
                                <label htmlFor="requestType">Request type</label>
                                <select name="leave" id="requestType">
                                    <option value="on-duty">On-Duty</option>
                                    <option value="permission">Permission</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="startDate">Start date</label>
                                <select name="startDate" id="startDate">
                                    <option value="today">{today}</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="endDate">End date</label>
                                <select name="endDate" id="endDate">
                                    <option value="today">{today}</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col items-center py-2 gap-4">
                            <label htmlFor="reason">Reason:</label>
                            <textarea 
                                id="reason" 
                                className="w-[50%] border-2 p-2" 
                                placeholder="Reason for requesting on-duty"
                            />
                            <button className="bg-violet-100 rounded-xl p-1">Send Request</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Student;
