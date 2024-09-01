import React from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import {useCookies} from 'react-cookie';
function Od_stu_LoginPage() {
  


    const [cookies, setCookie, removeCookie] =useCookies(null)
    const [isLogin, setIsLogin] = useState(true)
    const [error, setError]=useState(null)
    const [email, setEmail]=useState(null)
    const [password, setPassword]=useState(null)
    const [confirmPassword, setConfirmPassword]=useState(null)

console.log(cookies)

    const viewLogin=(status)=>{
        setIsLogin(status)
        setError(null)
    }

    const handleSubmit= async (e, endpoint)=>{
        e.preventDefault()
        if(!isLogin && password!==confirmPassword){
            setError('Passwords do not match')
            return
        }

        const response = await fetch(`http://localhost:3001/student${endpoint}`,{
            method:'POST',
            headers:{'Content-Type':'application/json' },
            body:JSON.stringify({email,password})
        })
        const data = await response.json()
        //console.log(data)
        if(data.detail){
            setError(data.detail)
        }else{
            setCookie('Email', data.email)
            setCookie('AuthToken',data.token);

            
            
            window.location.replace("http://localhost:3000/student")

        }
    }
  return (
    <>
      <div className="min-h-screen bg-violet-100 flex flex-col items-center justify-center">
        <h1 className="mt-2 mb-9 text-3xl font-semibold">DEPARTMENT OF CSBS</h1>
        <form className="w-full max-w-md flex flex-col shadow-2xl min-h-80 p-5 rounded-2xl bg-white">
          {/* <div className="absolute inset-1 flex items-center justify-center ">
          <h1 className="text-8xl pt-7 font-semibold text-violet-400">REC</h1>
        </div> */}

          <h1 className="flex justify-center items-center mb-9 text-2xl text-violet-800 font-bold">
            Welcome
          </h1>

          <div className="mb-4 z-10">
            {/* <label
            for="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label> */}
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-xl"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-8 z-10">
            {/* <label
            for="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
          >
            Your password
          </label> */}
            <input
              placeholder="Password"
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-xl"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && <input
              placeholder="Confirm Password"
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-xl"
              onChange={(e)=> setConfirmPassword(e.target.value)}
              required
            /> }
                <input type='submit' className='placeholder:text-center text-lg border-2 rounded-xl p-1 bg-purple-300 cursor-pointer hover:bg-purple-700' onClick={(e)=> handleSubmit(e, isLogin ? 'login' : 'signup')}/>
                {error && <p>{error}</p>}
          </div>
          {/* <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
          </div>
          <label
            for="remember"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Remember me
          </label>
        </div> */}
        
        <div className='flex mt-12 mx-2 gap-2'>
                <button onClick={()=> viewLogin(false)}
                className='text-xl rounded-lg p-2'
                style={{backgroundColor: !isLogin? '#07A417':'rgb(188,188,188)'}}
                >Sign Up</button>
                <button onClick={()=> viewLogin(true)}
                className='text-xl rounded-lg p-2'
                style={{backgroundColor: isLogin? '#07A417':'rgb(188,188,188)'}}
                >Login</button>
            </div>
          
        </form>
      </div>
    </>
  );
}

export default Od_stu_LoginPage;
