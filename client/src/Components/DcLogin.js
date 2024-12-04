import React from 'react'
import LoginPage from './LoginPage'
const Staff_login = () => {
  return (
    <div className='relative'>
          <LoginPage role="DC" loginEndpoint="dclogin" redirectPath="/adminControl" />

    </div>
  )
}

export default Staff_login