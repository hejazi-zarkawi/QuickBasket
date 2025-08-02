import CommonForm from '@/components/common/form'
import { RegisterFormControls } from '@/config'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '@/store/auth-slice'
import { toast } from 'react-hot-toast'

const Authregister = () => {

  const initialState = {
    userName: "",
    email: "",
    password: "",
  }

  const [formData, setFormData] = useState(initialState)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  function onSubmit(event){
    
    event.preventDefault();
    if (!usernameRegex.test(formData.userName)) {
      toast.error("Username must be 3-20 characters long and can only contain letters, numbers, and underscores.");
      return;
    }
    dispatch(registerUser(formData)).then((data) =>{
      console.log(data)
      if(data?.payload?.success){
        toast.success(data?.payload?.message)
        navigate('/auth/login');
      }
      else{
        toast.error(data?.payload?.message)
      }
    })
  }
  return (
    <div className='flex flex-col  w-full ml-20 md:ml-0 p-8 rounded-2xl bg-lime-50'>
      <div className='text-center flex flex-col gap-2 mb-6'>
        <h1 className='text-3xl font-bold'>Create an account</h1>
        <p>Already have an account? <Link className='ml-2 font-semibold hover:underline' to='/auth/login'>Login</Link> </p>
      </div>
      <div className='mt-2'>
        <CommonForm
        formControls ={RegisterFormControls}
        formData = {formData}
        setFormData = {setFormData}
        buttonText = {"Register Now"}
        onSubmit ={onSubmit}
        />
      </div>
    </div>
  )
}

export default Authregister