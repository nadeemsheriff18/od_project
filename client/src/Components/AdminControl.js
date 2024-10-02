import React, { useState } from 'react';
import axios from "axios";

function AdminControl() {
    const [file, setFile] = useState(null);
    const [studentsError, setStudentsError] = useState("");
    const [studentsSuccess, setStudentsSuccess] = useState("");
    const [attendanceError, setAttendanceError] = useState("");
    const [attendanceSuccess, setAttendanceSuccess] = useState("");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (
            selectedFile &&
            selectedFile.type !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
            selectedFile.type !== "application/vnd.ms-excel"
        ) {
            setStudentsError("Please upload a valid Excel file.");
            setFile(null);
        } else {
            setFile(selectedFile);
            setStudentsError(""); // Clear error message
            setAttendanceError(""); // Clear error message for attendance form as well
        }
    };

    const handleSubmitUpload = async (atd, event, isAttendanceUpload) => {
        event.preventDefault();

        if (!file) {
            const errorMessage = "Please choose a file to upload.";
            if (isAttendanceUpload) {
                setAttendanceError(errorMessage);
            } else {
                setStudentsError(errorMessage);
            }
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`/api/upload/upload${atd}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (isAttendanceUpload) {
                setAttendanceSuccess("Attendance file uploaded successfully");
                setAttendanceError(""); // Clear previous error
            } else {
                setStudentsSuccess("Students file uploaded successfully");
                setStudentsError(""); // Clear previous error
            }
            console.log("File uploaded successfully:", response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.nooverride 
                ? "One or more similar items found." 
                : "Failed to upload file.";
            
            if (isAttendanceUpload) {
                setAttendanceError(errorMessage);
                setAttendanceSuccess(""); // Clear previous success message
            } else {
                setStudentsError(errorMessage);
                setStudentsSuccess(""); // Clear previous success message
            }
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="flex mt-11 mb-11 flex-col min-h-screen">
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
                    onChange={handleFileChange}
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
                    onChange={handleFileChange}
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
    );
}

export default AdminControl;
