import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Card from './Card'; // Assuming you are using a Card component
import Loader from './Loading';

const History = () => {
  const { rollno } = useParams();
  const date = new Date();
  const today = date.toLocaleDateString();

  // State to manage expanded card
  const [expandedCardId, setExpandedCardId] = useState(null);

  // Function to fetch requests based on rollno
  const fetchRequests = async () => {
    if (!rollno) return []; // Handle the case when rollno is not available
    try {
      const response = await axios.get(`/api/Student/history/StuHistory/${rollno}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student history:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  };

  // Use query for fetching requests
  const { data: requests = [], isLoading, isError, error } = useQuery({
    queryKey: ['odRequests', rollno], // Cache based on rollno
    queryFn: fetchRequests,
    enabled: !!rollno, // Only run the query if rollno is available
    staleTime: 300000, // Cache data for 5 minutes
    cacheTime: 900000, // Keep cached data for 15 minutes
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });

  // Handle expanding/collapsing cards
  const handleToggleExpand = (id) => {
    setExpandedCardId((prevId) => (prevId === id ? null : id)); // Toggle between expand/collapse
  };

  if (isLoading) return <div className='flex justify-center items-center min-h-screen'>
    <Loader /> 
    
</div>;
  if (isError) return <div>Error loading data: {error.message}</div>;

  return (
    <>
      <div className="flex-col mt-20 px-6 ">
      <div className="flex flex-col justify-center items-center text-center">
  <h2 className="font-bold text-3xl">History</h2>
    <div className='mt-6'>
    {requests.length > 0 && (
    
    <div className="text-xl font-bold  text-left w-full max-w-md">
      <p className="my-2">ODs: {requests[0].OD}</p>
      <p className="my-2">Permissions: {requests[0].Permission}</p>
    </div>
  )}
    </div>
  
</div>

        <div className='flex justify-center items-center flex-1 flex-wrap '>
        
 
          {requests.length === 0 ? (
            <p>No history found for roll number {rollno}.</p>
          ) : (
            <ul>
              {requests.map((request) => (
                <Card
                  key={request.id}
                  data={request}
                  isExpanded={expandedCardId === request.id} // Pass the expand state to Card
                  onToggleExpand={() => handleToggleExpand(request.id)} // Toggle expand/collapse
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default History;
