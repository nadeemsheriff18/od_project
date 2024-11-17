import React from 'react'
import LoginPage from './LoginPage'
const Staff_login = () => {
  return (
    <div className='relative'>
          <LoginPage role="staff" loginEndpoint="classStafflogin" redirectPath="/staff" />

    </div>
  )
}

export default Staff_login