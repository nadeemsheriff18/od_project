import React, { useMemo } from 'react';

import { useCookies } from 'react-cookie';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
};

const Card = ({ data, live, onToggleExpand, isExpanded, onAccept, onDecline }) => {
  const [cookies] = useCookies(['Role']);
  
  const supervisor = "CSBS HOD";
  const od = data.Type === 'on-duty' ? data.OD : data.Permission;

  const attendancePercentage = useMemo(() => {
    return (((data.total_classes-data.absent_count) / data.total_classes) * 100).toFixed(1);
  }, [data.absent_count, data.total_classes]);

  // Handler to stop click event from propagating
  const handleButtonClick = (event) => {
    event.stopPropagation();
  };

  // Early return if no data
  if (!data) {
    return <div>No data available</div>;
  }

  const renderLabelValue = (label, value) => (
    <div className="flex flex-wrap mb-2">
      <p className="w-32 font-normal mr-4 text-purple-800">
        <strong>{label}:</strong>
      </p>
      <p className="flex-1 break-words text-gray-600">{value}</p>
    </div>
  );

  return (
    <div className="mt-8 shadow-lg bg-violet-100 rounded-lg p-6 max-w-3xl w-full cursor-pointer z-10" onClick={onToggleExpand}>
      <div className="flex">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${data.Type === "on-duty" ? 'text-purple-700 bg-purple-200' : 'text-blue-700 bg-blue-200'}`}>
          <span className="text-md font-bold">{data.Type}</span>
        </div>

        <div className="ml-4 flex-1">
          <div className="space-y-3 text-gray-700">
            {renderLabelValue("Name", data.stud_name)}
            {renderLabelValue("Register", data.RegNo)}
            {renderLabelValue("Department", data.department)}
            {renderLabelValue("Supervisor", supervisor)}
            {renderLabelValue("Req Date", formatDate(data.ReqDate))}
            {renderLabelValue(`${data.Type} Date`, `${formatDate(data.StartDate)} - ${formatDate(data.EndDate)}`)}
            {renderLabelValue("Subject", data.Subject)}

            {/* Attendance and ODs with conditional color */} 
            <div className="flex flex-wrap mb-2">
              <p className="w-32 font-normal mr-4 text-purple-800">
                <strong>Attendance:</strong>
              </p>
              <p className={`flex-1 font-semibold ${attendancePercentage <= 75 ? 'text-red-600' : 'text-green-600'}`}>
                {attendancePercentage}%
              </p>
            </div>

            <div className="flex flex-wrap mb-2"> 
              <p className="w-32 font-normal mr-4 text-purple-800">
                <strong>{`${data.Type}(s)`}:</strong>
              </p>
              <p className={`flex-1 font-semibold ${od >= 4 ? 'text-red-600' : 'text-green-600'}`}>
                {od}
              </p>
            </div>
          </div>
        </div>
        {
  cookies.Role === "student" ? null : (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
      {!live && (
        <button
          className="shadow-md text-white bg-green-500 font-medium py-2 px-4 rounded hover:bg-purple-200"
          onClick={(e) => {
            handleButtonClick(e);
            onAccept(data.id, data.RegNo, live); // Pass live correctly
          }}
        >
          Accept
        </button>
      )}
      <button
        className="shadow-md text-white bg-red-600 font-medium py-2 px-4 rounded hover:bg-purple-200"
        onClick={(e) => {
          handleButtonClick(e);
          onDecline(data.id, data.RegNo, live); // Pass live correctly
        }}
      >
        {!live ? "Decline" : "Remove"}
      </button>
    </div>
  )
}

        
      </div>

      <div 
        className={`mt-3 shadow-xl rounded-md bg-white pl-4 pr-4 pb-2 pt-1 transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-screen visible' : 'max-h-0 invisible overflow-hidden'}`}
        style={{ overflow: 'hidden' }}
      >
        <p><strong>Reason:</strong></p>
        <p className="mt-2 text-gray-600 break-words">{data.Reason}</p>
      </div>
    </div>
  );
};

export default Card;
