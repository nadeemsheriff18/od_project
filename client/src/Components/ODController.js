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
    },
  ]);

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-purple-700 mt-2">OD REQUEST</h2>
        <h3 className="text-xl font-medium text-purple-500 mt-2">LIVE OD / PERMISSION</h3>
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
      <div className=" mt-4 flex flex-col items-center">
        {activeTab === 'odRequest' && (
          <div className="w-full max-w-4xl overflow-x-hidden">
            {requests.map(request => (
              <Card
                key={request.id}
                data={request}
                isExpanded={expandedCardId === request.id}
                onToggleExpand={() => handleToggleExpand(request.id)}
              />
            ))}
          </div>
        )}

        {activeTab === 'liveOd' && (
          <div className="text-center mt-4 text-gray-600">
            {/* Placeholder for "LIVE OD / PERMISSION" content */}
            <p>No live OD requests available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ODController;
