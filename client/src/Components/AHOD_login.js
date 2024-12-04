import React from 'react'
import LoginPage from './LoginPage'
const AHOD_login = () => {
  return (
    <div className='relative'>
          <LoginPage role="ahod" loginEndpoint="ahodlogin"  redirectPath="/ahod" />

    </div>
  )
}

export default AHOD_login