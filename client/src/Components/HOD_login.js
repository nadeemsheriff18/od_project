import React from 'react'
import LoginPage from './LoginPage'
const HOD_login = () => {
  return (
<div className="relative">
     
<LoginPage role="admin" loginEndpoint="stafflogin" signupEndpoint="staffsignup" redirectPath="/admin" />

    </div>
  )
}

export default HOD_login