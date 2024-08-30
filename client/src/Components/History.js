import React from 'react'
import Odheader from './Odheader'
const History = () => {
    const date = new Date()

    const today = date.toLocaleDateString()
    return (
        <>
        <Odheader/>
        <div className='pt-36 px-6'>
        <div className='flex justify-center items-center'>
            <h2 className='font-bold text-3xl'>History</h2>
        </div>
        </div>
        </>
    )
}

export default History