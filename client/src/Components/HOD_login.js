import React from 'react'
import LoginPage from './LoginPage'
const HOD_login = () => {
  return (
<div className="relative">
     
<LoginPage role="hod" loginEndpoint="hodlogin" signupEndpoint="hodsignup" redirectPath="/hod" />

    </div>
  )
}

export default HOD_login