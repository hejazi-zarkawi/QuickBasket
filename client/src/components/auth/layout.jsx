import React from 'react'
import { Outlet } from 'react-router-dom'


const layout = () => {
  return (
    <div className='flex min-h-screen '>
        <div className='md:flex justify-center items-center hidden w-1/2 bg-black text-white'>
        <h1 className='font-bold text-3xl'>Welcome to Ecommerce Shopping</h1>
        
        </div>
        <div className='flex justify-center items-center w-1/2'>
        <div className='w-[60%]'>
            <Outlet/>
        </div>
        </div>
    </div>
  )
}

export default layout