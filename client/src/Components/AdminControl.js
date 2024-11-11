import React, { useState, useEffect } from 'react';
import axios from "axios";

function AdminControl() {
    const [studentFile, setStudentFile] = useState(null);
    const [attendanceFile, setAttendanceFile] = useState(null);
    const [studentsError, setStudentsError] = useState("");
    const [studentsSuccess, setStudentsSuccess] = useState("");
    const [attendanceError, setAttendanceError] = useState("");
    const [attendanceSuccess, setAttendanceSuccess] = useState("");
    
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [sectionToAdd, setSectionToAdd] = useState("");
    const [sectionsError, setSectionsError] = useState("");
    const [sectionsSuccess, setSectionsSuccess] = useState("");

    useEffect(() => {
        // Fetch years and their sections from the server when the component mounts
        const fetchYears = async () => {
            try {
                const response = await axios.get(`/api/upload/fetchingSections`);
                 console.log(response.data.Years);
                 setYears(response.data.Years)
            } catch (error) {
                console.error("Error fetching years and sections:", error);
            }
        };
        fetchYears();
    }, []);

    const handleFileChange = (event, isAttendanceUpload) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && !["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(selectedFile.type)) {
            if (isAttendanceUpload) {
                setAttendanceError("Please upload a valid Excel file.");
                setAttendanceFile(null);
            } else {
                setStudentsError("Please upload a valid Excel file.");
                setStudentFile(null);
            }
        } else {
            isAttendanceUpload ? setAttendanceFile(selectedFile) : setStudentFile(selectedFile);
            isAttendanceUpload ? setAttendanceError("") : setStudentsError("");
        }
    };

    const handleResetStudents = async () => {
        const confirmed = window.confirm("Are you sure you want to reset all student data?");
        if (!confirmed) return;
        try {
            const response = await axios.delete(`/api/upload/ResetPopulation`);
            response.status === 200 ? alert("Student data reset successfully.") : alert("Failed to reset student data.");
        } catch (error) {
            console.error("Error resetting student data:", error);
            alert("An error occurred while trying to reset student data.");
        }
    };

    const handleSubmitUpload = async (atd, event, isAttendanceUpload) => {
        event.preventDefault();
        const fileToUpload = isAttendanceUpload ? attendanceFile : studentFile;
        if (!fileToUpload) {
            const errorMessage = "Please choose a file to upload.";
            isAttendanceUpload ? setAttendanceError(errorMessage) : setStudentsError(errorMessage);
            return;
        }
        const formData = new FormData();
        formData.append("file", fileToUpload);
        try {
            const response = await axios.post(`/api/upload/upload${atd}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            if (isAttendanceUpload) {
                setAttendanceSuccess("Attendance file uploaded successfully");
                setAttendanceError(""); 
                setAttendanceFile(null); 
                document.getElementById('attendance_file_upload').value = "";
            } else {
                setStudentsSuccess("Students file uploaded successfully");
                setStudentsError("");
                setStudentFile(null); 
                document.getElementById('students_file_upload').value = ""; 
            }
            console.log("File uploaded successfully:", response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.nooverride ? "One or more similar items found." : "Failed to upload file.";
            isAttendanceUpload ? setAttendanceError(errorMessage) : setStudentsError(errorMessage);
            console.error("Error uploading file:", error);
        }
    };

    const handleAddSection = async () => {
        try {
            // Send the request to the server to add the section
            const response = await axios.post(`/api/upload/sections`, { year: selectedYear, section: sectionToAdd },{validateStatus: (status) => {
                // Accept 2xx and 409 status codes as successful responses
                return status >= 200 && status < 300 || status === 409;
            }});

            if (response.status === 200) {
                // On success, update the state
                setSectionsSuccess("Section added successfully.");
                setSectionsError("");
                setSectionToAdd("");  // Clear the section input field

                // Update the years state by adding the new section to the selected year
                setYears(prevYears => {
                    // Create a shallow copy of the prevYears object
                    const updatedYears = { ...prevYears };

                    // Check if the selected year exists in the updatedYears object
                    if (updatedYears[selectedYear]) {
                        // Add the new section to the array of sections for the selected year
                        updatedYears[selectedYear] = [...updatedYears[selectedYear], sectionToAdd];
                    }

                    // Return the updated state
                    return updatedYears;
                });
            }
            else if (response.status === 409) {
                // Conflict: Section already exists or some other conflict
                console.log(response.data.message);  // Assuming the server sends a message
                setSectionsError(response.data.message);  // Display the message to the user
            }
        } catch (error) {
            setSectionsError("Failed to add section.");
            console.error("Error adding section:", error);
        }
    };

    const handleRemoveSection = async (year, section) => {
        if(years[year].length<=1){
            setSectionsError("Year can't have no sections");
            return;
        }
        else{
            try {
                const response = await axios.delete(`/api/upload/sectionsdel`, { data: { year, section } });
                
                if (response.status === 200) {
                    // Update success message
                    setSectionsSuccess("Section removed successfully.");
                    setSectionsError("");
        
                    // Update the years state by removing the section from the relevant year
                    setYears(prevYears => {
                        // Create a shallow copy of the prevYears object
                        const updatedYears = { ...prevYears };
                        
                        // Check if the year exists in the updatedYears object
                        if (updatedYears[year]) {
                            // Filter out the section from the array of sections for the given year
                            updatedYears[year] = updatedYears[year].filter(sec => sec !== section).sort();
                        }
        
                        // Return the updated state
                        return updatedYears;
                    });
                }
            } catch (error) {
                setSectionsError("Failed to remove section.");
                console.error("Error removing section:", error);
            }
        }
        
    };
    

    return (
        <><div className="flex mt-11 mb-11 flex-col min-h-screen">
        <h1 className="text-center mt-10 mb-10 text-2xl font-bold">UPLOAD ITEMS</h1>
        <form className="max-w-2xl mx-auto px-4" onSubmit={(event) => handleSubmitUpload('Initial', event, false)}>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900" htmlFor="students_file_upload">
                Upload Students File
            </label>
            <input
                className="block w-full p-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="students_file_upload_help"
                id="students_file_upload"
                type="file"
                onChange={(event) => handleFileChange(event, false)}
                accept=".xlsx,.xls"
            />
            {studentsError && <p className="text-red-500 mt-2">{studentsError}</p>}
            {studentsSuccess && <p className="text-green-500 mt-2">{studentsSuccess}</p>}
            <button
                type="submit"
                className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Upload
            </button>
        </form>
        <form className="max-w-2xl mt-5 mx-auto px-4" onSubmit={(event) => handleSubmitUpload('Excel', event, true)}>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900" htmlFor="attendance_file_upload">
                Upload Attendance File
            </label>
            <input
                className="block w-full p-5 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="attendance_file_upload_help"
                id="attendance_file_upload"
                type="file"
                onChange={(event) => handleFileChange(event, true)}
                accept=".xlsx,.xls"
            />
            {attendanceError && <p className="text-red-500 mt-2">{attendanceError}</p>}
            {attendanceSuccess && <p className="text-green-500 mt-2">{attendanceSuccess}</p>}
            <button
                type="submit"
                className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Upload
            </button>
        </form>
    </div>
            {/* File upload forms */}
            {/* Danger Zone */}
            <div className="flex mt-5 mb-11 pb-11 flex-col bg-red-200 mx-36 rounded-xl">
                <h1 className="text-center mt-10 mb-10 text-2xl font-bold">DANGER ZONE</h1>
                <div className="max-w-2xl mx-auto px-4">
                    <label className="block mb-2 text-base font-medium text-gray-900 dark:text-gray-900" htmlFor="reset_students">
                        Reset all year attendance
                    </label>
                    <button onClick={handleResetStudents} className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Delete All Students
                    </button>
                </div>

                {/* Section management */}
                <div className="max-w-2xl mx-auto px-4 mt-10">
                        <h2 className="text-xl font-bold">Manage Sections</h2>
                        <label className="block mb-2 text-base font-medium text-gray-900 dark:text-gray-900">
                            Select Year and Add or Remove Sections
                        </label>
                        
                        {/* Dropdown for years */}
                        <select 
                            onChange={(e) => setSelectedYear(e.target.value)} 
                            className="w-full py-2 mb-4 border rounded-lg"
                        >
                            <option value="">Select a Year</option>
                            {Object.entries(years).map(([year]) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter Section to Add"
                            value={sectionToAdd}
                            onChange={(e) => setSectionToAdd(e.target.value)}
                        />
                        <button onClick={handleAddSection} className="w-full py-2 mt-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Add Section
                        </button>

                        {sectionsError && <p className="text-red-500 mt-2">{sectionsError}</p>}
                        {sectionsSuccess && <p className="text-green-500 mt-2">{sectionsSuccess}</p>}

                        <div className="mt-6">
                            {selectedYear && (
                                <div>
                                    <h3 className="font-semibold">Sections in Year {selectedYear}:</h3>
                                    <ul>
                                        {(years[selectedYear] || []).map((section) => (
                                            <li key={section} className="flex items-center justify-between my-2">
                                                {section}
                                                <button onClick={() => handleRemoveSection(selectedYear, section)} className="text-red-500 hover:underline">
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
            </div>
        </>
    );
}

export default AdminControl;
