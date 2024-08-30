import React, { useState } from 'react';
import Card from './Card';

function ODController() {
  // State to manage the list of requests
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Abinaya P",
      department: "Computer Science and Business Systems",
      supervisor: "HOD CSBS",
      year: "3rd Year",
      reqDate: "12/12/2022",
      odDate: "15/12/2022",
      sub: "SIH",
      Attendence : "65%",
      ODs : "2",
      sec:"A",
      sem:"3"
    },
    {
      id: 2,
      name: "John Doe",
      department: "Electrical Engineering",
      supervisor: "Prof. Smith",
      year: "2nd Year",
      reqDate: "10/12/2022",
      odDate: "20/12/2022",
      sub: "WORKSHOP",
      Attendence : "75%",
      ODs : "2",
      sec:"A",
      sem:"3"
    },
    {
      id: 3,
      name: "Jane Smith",
      department: "Mechanical Engineering",
      supervisor: "Dr. Johnson",
      year: "4th Year",
      reqDate: "01/12/2022",
      odDate: "10/12/2022",
      sub: "SIH",
      Attendence : "85%",
      ODs: "2",
      sec:"A",
      sem:"3"
    },
    {
      id: 4,
      name: "Jane Smith",
      department: "Mechanical Engineering",
      supervisor: "Dr. Johnson",
      year: "4th Year",
      reqDate: "01/12/2022",
      odDate: "10/12/2022",
      sub: "SIH",
      Attendence : "85%",
      ODs: "4",
      sec:"A",
      sem:"3"
    },
    {
      id: 5,
      name: "Jane Smith",
      department: "Mechanical Engineering",
      supervisor: "Dr. Johnson",
      year: "4th Year",
      reqDate: "01/12/2022",
      odDate: "10/12/2022",
      sub: "SIH",
      Attendence : "85%",
      ODs : "2",
      sec:"A",
      sem:"3"
    },
    {
      id: 6,
      name: "Jane Smith",
      department: "Mechanical Engineering",
      supervisor: "Dr. Johnson",
      year: "4th Year",
      reqDate: "01/12/2022",
      odDate: "10/12/2022",
      sub: "SIH",
      Attendence : "85%",
      ODs: "2",
      sec:"A",
      sem:"3"
    },
    {
      id: 7,
      name: "Jane Smith",
      department: "Mechanical Engineering",
      supervisor: "Dr. Johnson",
      year: "4th Year ",
      reqDate: "01/12/2022",
      odDate: "10/12/2022",
      sub: "SIH",
      Attendence : "85%",
      ODs: "0",
      sec:"A",
      sem:"3"

    },
  ]);

  // State to manage the accepted OD requests
  const [acceptedOD, setAcceptedOD] = useState([]);

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('odRequest');
  const [expandedCardId, setExpandedCardId] = useState(null);

  // Toggle the expanded state of a specific card
  const handleToggleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  // Handler to change the active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle Accept and Decline actions
  const handleAccept = (id) => {
    const acceptedRequest = requests.find(request => request.id === id);
    setRequests(requests.filter(request => request.id !== id));
    setAcceptedOD([...acceptedOD, acceptedRequest]);
  };

  const handleDecline = (id) => {
    setRequests(requests.filter(request => request.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-purple-700 mt-2">OD REQUEST</h2>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mt-4 flex border-b border-gray-300">
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'odRequest' ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
          onClick={() => handleTabChange('odRequest')}
        >
          OD REQUEST
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'liveOd' ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
          onClick={() => handleTabChange('liveOd')}
        >
          LIVE OD / PERMISSION
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4 flex flex-col items-center">
        {activeTab === 'odRequest' && (
          <div className="w-full max-w-4xl overflow-x-hidden">
            {requests.map(request => (
              <Card
              
              live={false}
                key={request.id}
                data={request}
                isExpanded={expandedCardId === request.id}
                onToggleExpand={() => handleToggleExpand(request.id)}
                onAccept={() => handleAccept(request.id)}
                onDecline={() => handleDecline(request.id)}
              />
            ))}
          </div>
        )}

        {activeTab === 'liveOd' && (
          <div className="flex flex-col items-center mt-4 text-gray-600">
            {acceptedOD.length === 0 ? (
              <p>No live OD requests available at the moment.</p>
            ) : (
                <>
                <div className='text-3xl font-medium text-black' >LIVE OD Count : {acceptedOD.length}</div>
                <div className="w-full max-w-4xl overflow-x-hidden">
                {acceptedOD.map(request => (
                  <Card
                    livve={true}
                    key={request.id}
                    data={request}
                    isExpanded={false} // No need to expand the accepted requests
                    onToggleExpand={() => {}}
                    onAccept={() => {}}
                    onDecline={() => {}}
                  />
                ))}
              </div>
                </>          
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ODController;
