import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Card from './Card';

function ODController() {
  const [requests, setRequests] = useState([]);
  const [acceptedOD, setAcceptedOD] = useState([]);
  const [activeTab, setActiveTab] = useState('odRequest');
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [subTab , setSubTab] = useState(1)

  // Fetch data based on the active tab
  const fetchRequests = useCallback(async () => {
    try {
      const response = await axios.get(`/api/ODController/fetchOD/${activeTab}`);
      if (activeTab === 'odRequest') {
        setRequests(response.data);
      } else if (activeTab === 'liveOd') {
        setAcceptedOD(response.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  }, [activeTab]);

  // Fetch data initially and when the active tab changes
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Toggle the expanded state of a specific card
  const handleToggleExpand = useCallback((id) => {
    setExpandedCardId(prevId => (prevId === id ? null : id));
  }, []);
  const handleSubTabChange  = useCallback ((subTab)=>{
    setSubTab(subTab);
  },[]);
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleAccept = useCallback(async (id, RegNo ) => {
    const acceptedRequest = requests.find(request => request.id === id);
    setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    setAcceptedOD(prevAcceptedOD => [...prevAcceptedOD, acceptedRequest]);
    const isRequestTab = activeTab === 'odRequest';
    try {
      await axios.patch(`/api/ODController/updateStatus`, {
        id,
        RegNo,
        status: 1,
        isRequestTab
         // Update status to 1 for accepted requests
      });

      // Re-fetch data to ensure UI is updated
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }, [requests, fetchRequests]);
  
  const handleDecline = useCallback(async (id, RegNo) => {
    const requestToDecline = requests.find(request => request.id === id);
    const isRequestTab = activeTab === 'odRequest';

    // Remove the declined request from the respective state
    if (isRequestTab) {
      setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
    } else {
      setAcceptedOD(prevAcceptedOD => prevAcceptedOD.filter(request => request.id !== id));
    }
    try {
      await axios.patch(`/api/ODController/updateStatus`, {
        id,
        RegNo,
        status: -1 ,// Update status to -1 for declined requests
        isRequestTab
      });

      // Re-fetch data to ensure UI is updated
      fetchRequests();
    } catch (error) {
      console.error('Error declining request:', error);

      // Rollback if there's an error
      if (isRequestTab) {
        setRequests(prevRequests => [...prevRequests, requestToDecline]);
      } else {
        setAcceptedOD(prevAcceptedOD => [...prevAcceptedOD, requestToDecline]);
      }
    }
  }, [requests, acceptedOD, activeTab, fetchRequests]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-purple-700 mt-2">OD REQUEST</h2>
      </div>
       {/* New Tabs */}
       <div className="mt-4 flex border-b border-gray-300">
        <button
          className={`py-2 px-4 text-lg font-medium ${subTab === 1 ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
          onClick={() => handleSubTabChange(1)}
        >
          Tab 1
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${subTab === 2 ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
          onClick={() => handleSubTabChange(2)}
        >
          Tab 2
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${subTab === 3 ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
          onClick={() => handleSubTabChange(3)}
        >
          Tab 3
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${subTab === 4 ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'}`}
          onClick={() => handleSubTabChange(4)}
        >
          Tab 4
        </button>
      </div>
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

      <div className="mt-4 flex flex-col items-center p-4">
        
        {activeTab === 'odRequest' && (
          <div className="w-full max-w-4xl overflow-x-hidden m-4">
            {requests.length === 0 ? (
              <p>No OD requests available at the moment.</p>
            ) : (
              requests.map(request => (
                <Card
                  live={false}
                  key={request.id}
                  data={request}
                  isExpanded={expandedCardId === request.id}
                  onToggleExpand={() => handleToggleExpand(request.id)}
                  onAccept={() => handleAccept(request.id, request.RegNo )}
                  onDecline={() => handleDecline(request.id, request.RegNo)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'liveOd' && (
          <div className="flex flex-col items-center mt-4 text-gray-600">
            {acceptedOD.length === 0 ? (
              <p>No live OD requests available at the moment.</p>
            ) : (
              <>
                <div className='text-3xl font-medium text-black'>LIVE OD Count : {acceptedOD.length}</div>
                <div className="w-full max-w-4xl overflow-x-hidden">
                  {acceptedOD.map(request => (
                    <Card
                      live={true}
                      key={request.id}
                      data={request}
                      isExpanded={expandedCardId === request.id}
                      onToggleExpand={() => handleToggleExpand(request.id)}
                      onAccept={() => {}}
                      onDecline={() => handleDecline(request.id, request.RegNo)}
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

