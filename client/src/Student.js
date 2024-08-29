import React from 'react'
import Navbar from './Navbar'
const Student = () => {

    const date=new Date()

   const today=date.toLocaleDateString()
    return (
        <>
            <Navbar />
            <div className='w-full h-screen bg-[#f6d7fc]'>
                <div className='flex justify-evenly items-center pt-7 px-16'>
                    <div className=''>
                        <img src='./assets/download.png' alt='user' className='w-[70%] h-[60%] rounded-3xl'></img>
                    </div>
                    <div className='flex flex-col gap-2 rounded-xl bg-[#fcfafc] p-4 font-sans text-xl'>
                        <p>Name:    Kavinraj</p>
                        <p>Roll number :    221401035</p>
                        <p>Department:    Computer science and business systems</p>
                        <p>Year:    3</p>
                        <p>Semester:    5</p>
                    </div>
                    <div>
                        Attendance
                    </div>
                </div>
                <div className='flex flex-col bg-[#fcfafc] mt-9 mx-16 rounded-xl'>
                    <div className='flex justify-evenly items-center py-3 px-10'>
                        <button className=''>OD request</button>
                        <button>Attendance</button>
                        <button>History</button>

                    </div>
                    <div className='flex justify-evenly items-center py-3 px-10'>
                        <div className='flex flex-col'>
                            <label>Leave Type</label>
                            <select name="leave" >
                                <option value="on-duty">On-Duty</option>
                                <option value="permission">Permission</option>

                            </select>
                        </div>
                        <div className='flex flex-col'>
                            <label>Start date</label>
                            <select name="start date" >
                                <option value="on-duty">{today}</option>
                                <option value="permission">Permission</option>

                            </select>
                        </div>
                        <div className='flex flex-col'>
                            <label>End date</label>
                            <select name="end date" >
                                <option value="on-duty">{today}</option>
                                <option value="permission">Permission</option>

                            </select>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

export default Student