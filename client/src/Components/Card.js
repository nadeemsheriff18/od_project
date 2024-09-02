import React from 'react';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
};

function Card({ data, live, onToggleExpand, isExpanded, onAccept, onDecline }) {
 
  data.supervisor = "CSBS HOD";
  let od=0;
  data.Type==='on-duty'? od=data.OD:od=data.Permission;
  

  // Handler to stop click event from propagating
  const handleButtonClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div 
      className="mt-8 shadow-lg bg-violet-100 rounded-lg p-6 max-w-3xl w-full cursor-pointer" 
      onClick={onToggleExpand}
    >
      <div className="flex">
        <div className={`w-16 h-16 rounded-full  flex items-center justify-center ${data.Type==="on-duty"? 'text-purple-700 bg-purple-200':'text-blue-700 bg-blue-200'}`}>
          <span className="text-md font-bold">{data.Type}</span>
        </div>

        <div className="ml-4 flex-1">
          <div className="space-y-3 text-gray-700">
            {data ? (
              <>
                {[
                  { label: "Name", value: data.stud_name },
                  { label: "Register", value: data.RegNo},
                  { label: "Department", value: data.department },
                  { label: "Supervisor", value: data.supervisor },
                  { label: "Year", value: data.year },
                  { label: "Section", value: data.sec },
                  { label: "Semester", value: data.sem },
                  { label: "Req Date", value: formatDate(data.ReqDate) },
                  { label: `${data.Type} Date`, value: `${formatDate(data.StartDate)} - ${formatDate(data.EndDate)}` },
                  { label: "Subject", value: data.Subject },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-wrap mb-2">
                    <p className="w-32 font-normal mr-4 text-purple-800">
                      <strong>{label}:</strong>
                    </p>
                    <p className="flex-1 break-words text-gray-600">
                      {value}
                    </p>
                  </div>
                ))}

                {/* Attendance and ODs with conditional color */} 
                <div className="flex flex-wrap mb-2">
                  <p className="w-32 font-normal mr-4 text-purple-800">
                    <strong>Attendenc:</strong>
                  </p>
                  <p className={`flex-1 font-semibold ${data.Attendence <= 75 ? 'text-red-600' : 'text-green-600'}`}>
                    {data.Attendence}%
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
              </>
            ) : (
              <div>No data available</div>
            )}
          </div>
        </div>
          <div className="flex justify-center items-center gap-4 mt-4">
          {!live && (
            <button 
              className="bg-white shadow-md text-purple-700 font-medium py-2 px-4 rounded hover:bg-purple-200"
              onClick={(e) => { handleButtonClick(e); onAccept(); }}
            >
              Accept
            </button>)}
            <button 
              className="bg-white shadow-md text-purple-700 font-medium py-2 px-4 rounded hover:bg-purple-200"
              onClick={(e) => { handleButtonClick(e); onDecline(); }}
            >
              {!live? "Decline":"Remove"}
            </button>
          </div>
        
      </div>

      <div 
        className={`mt-3 shadow-xl rounded-md bg-white pl-4 pr-4 pb-2 pt-1 transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-screen visible' : 'max-h-0 invisible overflow-hidden'}`}
        style={{ overflow: 'hidden' }}
      >
        <p><strong>Reason:</strong></p>
        <p className="mt-2 text-gray-600 break-words">
          {data.Reason}
        </p>
      </div>
    </div>
  );
}

export default Card;
