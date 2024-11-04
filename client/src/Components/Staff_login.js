import React from 'react'
import LoginPage from './LoginPage'
const Staff_login = () => {
  return (
    <div className='relative'>
          <LoginPage role="staff" loginEndpoint="classStafflogin" signupEndpoint="classStaffsignup" redirectPath="/staff" />

    </div>
  )
}

export default Staff_login