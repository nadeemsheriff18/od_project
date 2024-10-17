import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Card from './Card';
import { useCookies } from 'react-cookie';
import Loader from "./Loading";
import { useHistory } from 'react-router-dom';
function ODController() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('odRequest');
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [subTab, setSubTab] = useState(1);
  const [subSections, setSubSections] = useState('A');
  const [cookies] = useCookies(['Role']);
  const history = useHistory(); 

  // Fetch requests based on active tab
  const fetchRequests = async () => {
    const response = await axios.get(`/api/ODController/fetchOD/${activeTab}`, {
      params: { year: subTab, section: subSections ,role: cookies.Role},
    });
    return response.data;
  };

  // Use query for fetching requests
  const { data: requests = [],isLoading } = useQuery({
    queryKey: ['odRequests', activeTab, subTab, subSections],
    queryFn: fetchRequests,
  });

  // Use mutation for accepting requests
  const mutation = useMutation({
    mutationFn: async ({ id, RegNo,Type, live }) => {
      await axios.patch(`/api/ODController/updateStatus`, {
        id,
        RegNo,
        status: 1, // Update status to accepted
        live:live,
        role:cookies.Role,
        Type,
      });
    },
    onSuccess: () => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries(['odRequests']);
    },
    onError: (error) => {
      console.error('Error updating status:', error);
    },
  });
  const mutation1 = useMutation({
    mutationFn: async ({ id, RegNo ,Type, live }) => {
      await axios.patch(`/api/ODController/updateStatus`, {
        id,
        RegNo,
        status: -1, // Update status to declined
        live:live,
        role:cookies.Role,
        Type,
      });
    },
    onSuccess: () => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries(['odRequests']);
    },
    onError: (error) => {
      console.error('Error updating status:', error);
    },
  });

  const handleAccept = (id, RegNo, Type ,live) => {
    mutation.mutate({ id, RegNo,Type,live });
  
  };

  const handleDecline = async (id, RegNo ,Type, live) => {
    mutation1.mutate({ id, RegNo ,Type, live });
  };

  const handleToggleExpand = (id) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSubTabChange = (year) => {
    setSubTab(year);
  };

  const handleSubSectionChange = (section) => {
    setSubSections(section);
  };
  const handleGenerateReport = () => {
    history.push('/report'); // Use history.push to navigate to the report page
  };

  const Years = [1, 2, 3, 4];
  const yearSections = {
    1: ['A', 'B', 'C'],
    2: ['A', 'B'],
    3: ['A', 'B'],
    4: ['A'],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center overflow-x-hidden">
      <h2 className="text-2xl font-semibold text-purple-700 mt-2">REQUEST</h2>
      <div className="mt-4 flex border-b border-gray-300">
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'odRequest' ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'
            }`}
          onClick={() => handleTabChange('odRequest')}
        >
           REQUEST
        </button>
        <button
          className={`py-2 px-4 text-lg font-medium ${activeTab === 'liveOd' ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'
            }`}
          onClick={() => handleTabChange('liveOd')}
        >
          {cookies.Role==="ahod"?"Forwarded to HOD":"LIVE"}
        </button>
      </div>

      <div className="flex">

        {Years.map((year) => (
          <button
            key={year}
            className={`py-2 px-4 text-lg font-medium ${subTab === year ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'
              }`}
            onClick={() => handleSubTabChange(year)}
          >
            {year} year
          </button>
        ))}
      </div>
      <div className="flex">
        {yearSections[subTab].map((section) => (
          <button
            key={section}
            className={`py-2 px-4 text-lg font-medium ${subSections === section ? 'border-b-2 border-purple-500 text-purple-700' : 'text-gray-600'
              }`}
            onClick={() => handleSubSectionChange(section)}
          >
            {section}
          </button>
        ))}
      </div>
      {isLoading?(<div className='flex justify-center items-center mt-9 pt-9'>
      <Loader />
    </div>):(<>{activeTab === 'liveOd' && <div className='block mt-5 font-semibold text-xl'><h2>{cookies.Role==="ahod"?"Pending":"Live" } Count : {requests.length}</h2> </div>}
      <div className="mt-4 flex flex-col items-center p-4">
        {activeTab === 'odRequest' && (
          <div className="w-full max-w-4xl overflow-x-hidden m-4">
            {requests.length === 0 ? (
              <p className='text-center' >No Requests available at the moment.</p>
            ) : (
              requests.map((request) => (
                <Card
                  live={false}
                  key={request.id}
                  data={request}
                  isExpanded={expandedCardId === request.id}
                  onToggleExpand={() => handleToggleExpand(request.id)}
                  onAccept={handleAccept}
                  onDecline={ handleDecline}
                />
              ))
            )}
          </div>
        )}
        {activeTab === 'liveOd' && (
          <div className="flex flex-col items-center mt-4 text-gray-600">

            {requests.length === 0 ? (

              <p className='text-center'>No {cookies.Role==="ahod"?"Pending":"Live" } Request available at the moment.</p>


            ) : (


              <div className="w-full max-w-4xl overflow-x-hidden">
                {requests.map((request) => (
                  <Card
                    live={true}
                    key={request.id}
                    data={request}
                    isExpanded={expandedCardId === request.id}
                    onToggleExpand={() => handleToggleExpand(request.id)}
                    onDecline={handleDecline}
                  />
                ))}
              </div>

            )}
          </div>
        )}
      </div></>)}
      
<button
        className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
        onClick={handleGenerateReport}
      >
        Generate OD Report
      </button>

    </div>
  );
}

export default ODController;
