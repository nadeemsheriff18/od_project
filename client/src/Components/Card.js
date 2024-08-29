import React from 'react';

function Card({ data, onToggleExpand, isExpanded }) {
  return (
    <div 
      className="mt-8 shadow-lg bg-violet-100 rounded-lg p-6 max-w-3xl w-full cursor-pointer" 
      onClick={onToggleExpand}
    >
      <div className="flex">
        <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center">
          <span className="text-xl font-bold text-purple-700">A</span>
        </div>

        <div className="ml-4 flex-1">
          <div className="space-y-3 text-gray-700">
            {data ? (
              <>
                {[
                  { label: "Name", value: data.name },
                  { label: "Department", value: data.department },
                  { label: "Supervisor", value: data.supervisor },
                  { label: "Year", value: data.year },
                  { label: "Req Date", value: data.reqDate },
                  { label: "OD Date", value: data.odDate },
                  { label: "Subject", value: data.sub },
                ].map(({ label, value }) => (
                  <div key={label} className="flex">
                    <p className="w-32 font-normal mr-4 text-purple-800 whitespace-nowrap overflow-hidden text-ellipsis">
                      <strong>{label}:</strong>
                    </p>
                    <p className="flex-1 overflow-hidden text-ellipsis">{value}</p>
                  </div>
                ))}
              </>
            ) : (
              <div>No data available</div>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-4">
          <button className="bg-white shadow-md text-purple-700 font-medium py-2 px-4 rounded hover:bg-purple-200">
            Accept
          </button>
          <button className="bg-white shadow-md text-purple-700 font-medium py-2 px-4 rounded hover:bg-purple-200">
            Decline
          </button>
        </div>
      </div>

      <div 
        className={` mt-4 shadow-xl rounded-md bg-white pl-4 pr-4 pb-2 pt-2 transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-screen visible' : 'max-h-0 invisible overflow-hidden'}`}
        style={{ overflow: 'hidden' }}
      >
        <p><strong>Reason:</strong></p>
        <p className={`mt-2 text-gray-600`}>
          I hope this message finds you well. I am writing to seek your kind permission 
          to attend a hackathon organized by [Organizing Body/College Name] on [Date(s) of 
          the Hackathon]. The event will take place at [Venue], and it is a great opportunity 
          for me to enhance my skills and gain practical experience in [mention the specific area 
          or technology if relevant]. I assure you that I will complete all my academic responsibilities 
          before and after the event, and I will not let this affect my coursework. I would be grateful 
          for your approval to attend this event.
        </p>
      </div>
    </div>
  );
}

export default Card;
