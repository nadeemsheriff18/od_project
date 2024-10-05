import React, { useState } from 'react';
import axios from "axios";

function AdminControl() {
    const [studentFile, setStudentFile] = useState(null);
    const [attendanceFile, setAttendanceFile] = useState(null);
    const [studentsError, setStudentsError] = useState("");
    const [studentsSuccess, setStudentsSuccess] = useState("");
    const [attendanceError, setAttendanceError] = useState("");
    const [attendanceSuccess, setAttendanceSuccess] = useState("");

    const handleFileChange = (event, isAttendanceUpload) => {
        const selectedFile = event.target.files[0];

        if (
            selectedFile &&
            selectedFile.type !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
            selectedFile.type !== "application/vnd.ms-excel"
        ) {
            if (isAttendanceUpload) {
                setAttendanceError("Please upload a valid Excel file.");
                setAttendanceFile(null);
            } else {
                setStudentsError("Please upload a valid Excel file.");
                setStudentFile(null);
            }
        } else {
            if (isAttendanceUpload) {
                setAttendanceFile(selectedFile);
                setAttendanceError(""); // Clear error message
            } else {
                setStudentFile(selectedFile);
                setStudentsError(""); // Clear error message
            }
        }
    };

    const handleSubmitUpload = async (atd, event, isAttendanceUpload) => {
        event.preventDefault();

        const fileToUpload = isAttendanceUpload ? attendanceFile : studentFile;

        if (!fileToUpload) {
            const errorMessage = "Please choose a file to upload.";
            if (isAttendanceUpload) {
                setAttendanceError(errorMessage);
            } else {
                setStudentsError(errorMessage);
            }
            return;
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);

        try {
            const response = await axios.post(`/api/upload/upload${atd}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (isAttendanceUpload) {
                setAttendanceSuccess("Attendance file uploaded successfully");
                setAttendanceError(""); // Clear previous error
                setAttendanceFile(null); // Clear attendance file
                document.getElementById('attendance_file_upload').value = ""; // Clear the input field
            } else {
                setStudentsSuccess("Students file uploaded successfully");
                setStudentsError(""); // Clear previous error
                setStudentFile(null); // Clear student file
                document.getElementById('students_file_upload').value = ""; // Clear the input field
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
    );
}

export default AdminControl;
