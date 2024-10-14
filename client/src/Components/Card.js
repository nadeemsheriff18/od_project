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
    <div className="mt-8 shadow-lg bg-violet-100 rounded-lg p-6 max-w-4xl w-auto cursor-pointer z-10" onClick={onToggleExpand}>
      <div className="flex">
        <div className={`w-16 h-16 relative rounded-full flex items-center justify-center ${data.Type === "on-duty" ? 'text-purple-700 bg-purple-200' : 'text-blue-700 bg-blue-200'}`}>
          <span className="text-md text-nowrap font-bold">{data.Type}</span>
          
        </div>
        
        

        <div className="ml-4 flex-1">
        
          <div className="space-y-3 text-gray-700">
          {cookies.Role === "student" ? (
  <>
 
 <div className='flex gap-1'>

 

 
 {/* <p className={`font-bold bg-opacity-25 w-fit rounded-md p-1 
  ${data.Astatus === -20 || data.Astatus === 0 ? 'text-blue-500 bg-blue-500 ' : ''}
  ${data.Astatus === -21 || data.Astatus === 1 ? 'text-green-500 bg-green-500' : ''}
  ${data.Astatus === -19 || data.Astatus === -1 ? 'text-red-500 bg-red-500' : ''}
`}>
  {data.Astatus === -20 && 'IGNORED'}
  {data.Astatus === -21 && 'ACCEPTED'}
  {data.Astatus === -19 && 'REJECTED'}
  {data.Astatus === 0 && 'PENDING'}
  {data.Astatus === 1 && 'ACCEPTED'}
  {data.Astatus === -1 && 'REJECTED'}

 
  
</p>
<p className={`font-bold bg-opacity-25 w-fit rounded-md p-1 
  ${(data.Astatus >= 0)  ? 'text-green-500 bg-green-500' : ''} 
  ${(data.Astatus <= -20)? 'text-red-500 bg-red-500' : ''}
`}>
  {(data.Astatus >= 0) ? 'LIVE' : (data.Astatus <= -20)&&'EXPIRED'}
</p> */}
<ol className="flex  justify-between  w-2/4">
  {/* Step 1: AHOD Status */}
  {data.Astatus <= -19 ? (
    <div className="relative mr-1 sm:mr-5 pt-1 ">
      <div className="flex items-center">
        <div className={`z-10 flex items-center  pb-1 justify-center w-6 h-6 rounded-full ${data.Astatus <= -19 ? 'bg-blue-500' : 'bg-gray-500'} shrink-0`}>
        <p className="text-white font-bold text-center">&#8226;</p>
        </div>
      </div>
      <div className="mt-1 text-center"> {/* Adjusted margin-top */}
        <h3 className={'font-medium w-1 invisible sm:w-auto sm:visible text-blue-500'}> Expired</h3>
      </div>
    </div>
  ) : null}

  <li className="relative w-full ">
    <div className="flex items-center  pt-1">
      <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full ${
        data.AHOD_accept === 0 ? 'bg-yellow-500' : // Pending by AHOD
        data.AHOD_accept === -1 ? 'bg-red-500' : // Rejected by AHOD
        data.AHOD_accept === 1 ? 'bg-green-500' : // Accepted by AHOD
        'bg-gray-200' // Default
      } shrink-0`}>
        {data.AHOD_accept === 0 ? (
          <p className='text-white font-medium pb-0.5 flex justify-center items-center'>?</p>
        ) : data.AHOD_accept === -1 ? (
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="13" fill="#ffffff" height="13"  stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 50 50">
<path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
</svg>
          
        ) : data.AHOD_accept === 1 ? (
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
            <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
          </svg>
        ) : null}
      </div>
      <div className={`w-full h-[0.155rem] ${data.AHOD_accept === 1 ?  'bg-green-500':'bg-gray-500'}`}></div>
    </div>
    <div className="pt-1 text-left"> {/* Adjusted margin-top */}
      <h3 className="font-medium text-sm">AHOD</h3>
    </div>
  </li>

  {/* Step 2: HoD Status */}
  <li className="relative w-full">
    <div className="flex items-center pt-1">
      <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full ${
        (data.Astatus === 0 || data.Astatus === -20) && data.AHOD_accept === 1 ? 'bg-yellow-500' : // Pending by HoD
        (data.Astatus === -1 || data.Astatus === -19) ? 'bg-red-500' : // Rejected by HoD
        (data.Astatus === 1 || data.Astatus === -21) ? 'bg-green-500' : // Accepted by HoD
        'bg-gray-500' // Default
      } shrink-0`}>
        {(data.Astatus === 0 || data.Astatus === -20) && data.AHOD_accept === 1 ? (
          <p className='text-white font-medium pb-0.5 flex justify-center items-center'>?</p>
        ) : (data.Astatus === -1 || data.Astatus === -19) ? (
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="13" fill="#ffffff" height="13"  stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 50 50">
<path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
</svg>
        ) : (data.Astatus === 1 || data.Astatus === -21) ? (
          <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
          <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
        </svg>
        ) : null}
      </div>
      
    </div>
    <div className="pt-1 text-left"> {/* Adjusted margin-top */}
      <h3 className="font-medium text-sm">HOD</h3>
    </div>
  </li>
</ol>














 </div>
  </>
) : null}
          
          {cookies.Role !== "student" ? (
  <>
 
    {renderLabelValue("Name", data.stud_name)}
    {renderLabelValue("Register", data.RegNo)}
    {renderLabelValue("Department", data.department)}
  </>
) : null}
            
            
            {renderLabelValue("Supervisor", supervisor)}
            {renderLabelValue("Req Date", formatDate(data.ReqDate))}
            {renderLabelValue(`${data.Type} Date`, `${formatDate(data.StartDate)} - ${formatDate(data.EndDate)}`)}
            {renderLabelValue("Subject", data.Subject)}

            {/* Attendance and ODs with conditional color */} 
            {cookies.Role !== "student" ? (
  <>
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
  </>
) : null}
            
            
          </div>
        </div>
        {
  cookies.Role === "student" ? null : (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
      {!live && (
        <button
          className="shadow-md text-white text-center bg-green-500 font-medium py-2 px-4 rounded hover:bg-green-600"
          onClick={(e) => {
            handleButtonClick(e);
            onAccept(data.id, data.RegNo,data.Type , live); // Pass live correctly
          }}
        >
          {cookies.Role==="ahod"?"Forward":"Accept" }
        </button>
      )}
      <button
        className="shadow-md text-white bg-red-500 font-medium py-2 px-4 rounded hover:bg-red-600"
        onClick={(e) => {
          handleButtonClick(e);
          onDecline(data.id, data.RegNo,data.Type. live); // Pass live correctly
         
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
