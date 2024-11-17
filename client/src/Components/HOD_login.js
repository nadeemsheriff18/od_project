import React from 'react'
import LoginPage from './LoginPage'
const HOD_login = () => {
  return (
<div className="relative">
     
<LoginPage role="admin" loginEndpoint="stafflogin" redirectPath="/admin" />

    </div>
  )
}

export default HOD_login