import React, { useEffect, useState } from 'react';
// import  { useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useQuery } from '@tanstack/react-query';
import Loader from './Loading';

const Student = () => {
    const now = new Date();
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const [requestType, setRequestType] = useState('on-duty');
    const [startDate, setStartDate] = useState(formattedDate);
    const [endDate, setEndDate] = useState(formattedDate);
    const [reason, setReason] = useState('');
    const [subject, setSubject] = useState('');
    const [cookies] = useCookies(['Email', 'AuthToken']);
    const [attachedFile, setAttachedFile] = useState(null);
    // const [studentData, setStudentData] = useState(null); // Access the cookies you set earlier

    const MAX_CHARACTERS = 90; // Adjust the limit as needed  
    // useEffect(() => {
    //     const fetchStudentData = async () => {
    //         try {
    //             console.log(`Fetching data from URL: /api/Student/${cookies.Email}`);
    //             const response = await axios.get(`/api/Student/${cookies.Email}`);
    //             console.log('Response:', response.data);
    //             if (response.status === 200) {
    //                 setStudentData(response.data);
    //             } else {
    //                 console.error('Failed to fetch student data');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching student data:', error);
    //         }
    //     };

    //     if (cookies.Email) {
    //         fetchStudentData();
    //     }
    // }, [cookies.Email]);
    const fetchStudentData = async (email) => {
      const response = await axios.get(`/api/Student/${email}`);
      if (response.status !== 200) {
          throw new Error('Failed to fetch student data');
      }
      return response.data;
  };
  const { data: studentData = [], isLoading, isError, error } = useQuery({
    queryKey: ['studentData', cookies.Email], // Cache based on email
    queryFn: () => fetchStudentData(cookies.Email),
    enabled: Boolean(cookies.Email), // Only run the query if the email is available
    staleTime: 300000, // Cache data for 5 minutes
    cacheTime: 900000, // Keep cached data for 15 minutes
    refetchOnWindowFocus: false, // Disable refetch on window focus
});
    
     
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        alert(`File size should not exceed 2 MB. Your file size is ${Math.round(file.size / 1024)} KB.`);
        e.target.value = ''; // Clear the input if the file is too large
      } else {
        // Proceed with your logic for a valid file
        setAttachedFile(file);
      }
      
  };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (subject.length > MAX_CHARACTERS) {
            alert(`The subject cannot exceed ${MAX_CHARACTERS} characters.`);
            return;
        }

        const formData = new FormData();
        formData.append('RegNo', studentData?.rollno);
        formData.append('requestType', requestType);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('reason', reason);
        formData.append('subject', subject);
        formData.append('formattedDate', formattedDate);
        if (attachedFile) {
          formData.append('file', attachedFile);
      }

        console.log(formData);

        try {
            const response = await axios.post('/api/Student/submitOD', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });

            if (response.status === 200) {
                alert('Request submitted successfully');
                // Reset form or handle success
                setRequestType('on-duty');
                setStartDate('formattedDate');
                setEndDate('formattedDate');
                setReason('');
                setSubject(''); // Reset subject field
                setAttachedFile(null);
            } else {
                alert('Failed to submit request');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the request');
        }
    };
    if (isError) return <div>Error loading data: {error.message}</div>;
    return (
        <div className="w-full min-h-screen bg-violet-100 pt-24">
          
          {/* Main container for the profile and OD info */}
          <div className="flex flex-col lg:flex-row justify-evenly items-center pt-7 px-6 lg:px-24">
            
            {/* Profile / OD Info Section */}
            <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
              <div className="text-lg font-bold text-purple-800">OD :</div>
            </div>
            
            {/* Student Information */}
            <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-xl font-sans text-sm md:text-lg text-gray-700 w-full lg:w-1/3">
            {isLoading?(<div className='flex justify-center items-center mt-9 pt-9'>
      <Loader />
    </div>):(<> <div className="flex flex-wrap mb-2">
                <p className="w-32 font-normal mr-4 text-purple-800">
                  <strong>Name:</strong>
                </p>
                <p className="flex-1 font-semibold break-words text-black">
                  {studentData?.stud_name || 'Loading...'}
                </p>
              </div>
              <div className="flex flex-wrap mb-2">
                <p className="w-32 font-normal mr-4 text-purple-800">
                  <strong>Roll number:</strong>
                </p>
                <p className="flex-1 font-semibold break-words text-black">
                  {studentData?.rollno || 'Loading...'}
                </p>
              </div>
              <div className="flex flex-wrap mb-2">
                <p className="w-32  font-normal mr-4 text-purple-800">
                  <strong>Department:</strong>
                </p>
                <p className="flex-1 font-semibold break-words text-black">
                  {studentData?.department || 'Loading...'}
                  &nbsp;'{studentData?.sec || 'Loading...' }'
                </p>
              </div>
              <div className="flex flex-wrap mb-2">
                <p className="w-32 font-normal mr-4 text-purple-800">
                  <strong>Year:</strong>
                </p>
                <p className="flex-1 font-semibold break-words text-black">
                  {studentData?.year || 'Loading...'}
                </p>
              </div>
              <div className="flex flex-wrap mb-2">
                <p className="w-32 font-normal mr-4 text-purple-800">
                  <strong>Semester:</strong>
                </p>
                <p className="flex-1 font-semibold break-words text-black">
                  {studentData?.sem || 'Loading...'}
                </p>
              </div>
              <div className="flex flex-wrap mb-2">
                <p className="w-32 font-normal mr-4 text-purple-800">
                  <strong>CGPA:</strong>
                </p>
                <p className="flex-1 font-semibold break-words text-black">
                  {studentData?.cgpa || 'Loading...'}
                </p>
              </div>
              <div className="flex flex-wrap mb-2">
                <p className="w-32  font-normal mr-4 text-purple-800">
                  <strong>Attendance:</strong>
                </p>
                <p className="flex-1  font-semibold break-words text-black">
                  {(((studentData?.total_classes-studentData?.absent_count) / studentData?.total_classes) * 100).toFixed(1) || 'Loading...'}%
                </p>
              </div></>)}
             
            </div>
    
            {/* OD Info Section */}
            <div className="w-full p-6 lg:w-1/3 flex flex-col items-center lg:items-start text-lg font-bold text-purple-800">
              <div>OD : {studentData?.OD }</div>
              <div>Permission : {studentData?.Permission}</div>
            </div>
          </div>
    
          {/* Form Section */}
          <div className="flex flex-col bg-[#fcfafc] mt-9 mx-6 lg:mx-16 rounded-xl mb-9 shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row justify-evenly items-center py-3 px-6 lg:px-10">
                <button type="button" className="bg-violet-100 rounded-xl p-2 w-full lg:w-auto mb-4 lg:mb-0">
                  OD request
                </button>
                <Link to={`/history/${studentData?.rollno}`} className="w-full lg:w-auto">
                  <button type="button" className="w-full lg:w-auto">
                    History
                  </button>
                </Link>
              </div>
    
              {/* Request Form */}
              <div className="flex flex-col">
                <div className="flex flex-col lg:flex-row justify-evenly items-center py-3 px-6 lg:px-10 gap-4">
                  <div className="flex flex-col w-full lg:w-1/3">
                    <label htmlFor="requestType">Request type</label>
                    <select
                      name="requestType"
                      id="requestType"
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="border rounded-lg p-2"
                    >
                      <option value="on-duty">On-Duty</option>
                      <option value="permission">Permission</option>
                      <option value="leave">Leave</option>
                    </select>
                  </div>
                  <div className="flex flex-col w-full lg:w-1/3">
                    <label htmlFor="startDate">Start date</label>
                    <input
                      required
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={startDate}
                      min={formattedDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="border rounded-lg p-2"
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-1/3">
                    <label htmlFor="endDate">End date</label>
                    <input
                      required
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="border rounded-lg p-2"
                    />
                  </div>
                </div>

                {/* Text Areas */}
                
                <div className="flex flex-col items-center px-6 py-4 gap-4">
                  <div className="w-full lg:w-2/3 flex flex-col" >
                  <label for="fileUpload">Upload Document (optional):</label>
                  <input className='mx-1 py-2 w-fit' type="file" id="fileUpload" required={requestType==="leave"?true:false} name="fileUpload" accept="application/pdf, image/*" onChange={handleFileChange}></input>
                  </div>
                  <div className="w-full lg:w-2/3">
                    
                    <label htmlFor="subject">Subject:</label>
                    <p>{MAX_CHARACTERS - subject.length} characters remaining</p>
                    <textarea
                      required
                      id="subject"
                      className="w-full border-2 mx-1 py-2 sm:px-4 rounded-lg"
                      placeholder="Subject of the OD / permission"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      maxLength={MAX_CHARACTERS}
                    />
                  </div>
                  <div className="w-full lg:w-2/3">
                    <label htmlFor="reason">Reason:</label>
                    <textarea
                      required
                      id="reason"
                      className="w-full border-2 mx-1 py-2 sm:px-4 rounded-lg"
                      placeholder="Reason for requesting on-duty"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-violet-100 rounded-xl p-2 w-full lg:w-1/2"
                    disabled={subject.length > MAX_CHARACTERS}
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    };
export default Student;
