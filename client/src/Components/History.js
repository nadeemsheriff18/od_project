import React, { useState } from 'react';
import { useQuery,useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Card from './Card';
import { useParams } from 'react-router-dom';

const History = () => {
    const date = new Date()
    const { rollno } = useParams();

    const today = date.toLocaleDateString()
    const fetchRequests = async (rollno) => {
        try {
          const response = await axios.get(`/api/Student/history/StuHistory/${rollno}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching student history:', error);
          throw error; // Rethrow the error to be handled by the caller
        }
      };
    
      // Use query for fetching requests
      const { data: requests = [] } = useQuery({
        queryKey: ['odRequests',regno],
        queryFn: fetchRequests,
      });

    return (
        <>
        <div className='pt-36 px-6'>
        <div className='flex justify-center items-center'>
            <h2 className='font-bold text-3xl'>History</h2>
        </div>

        
        </div>
        </>
    )
}

export default History