import CommonForm from '@/components/common/form'
import { loginFormControls } from '@/config'
import React,{useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '@/store/auth-slice'
import { toast } from 'react-hot-toast'

const AuthLogin = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialState = {
    email: "",
    password: "",
  }

  const [formData, setFormData] = useState(initialState)
  const {isAuthenticated, user} = useSelector((state)=> state.auth);


  function onSubmit(event){
    event.preventDefault();
    dispatch(loginUser(formData)).then((data)=>{
      if(data?.payload?.success){
        toast.success(data?.payload?.message)
        console.log(data.payload.user)
        if (data.payload.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/shop/home');
        }
      }
      else{
        toast.error(data?.payload?.message)
      }
    })
  }

  return (
    <div className='flex flex-col  w-full ml-20 md:ml-0 p-8 rounded-2xl bg-lime-50'>
      <div className='text-center flex flex-col gap-2 mb-6'>
        <h1 className='text-3xl font-bold'>Log in to your account</h1>
        <p>Don't have an account? <Link className='ml-2 font-semibold hover:underline' to='/auth/register'>Register</Link> </p>
      </div>
      <div className='mt-2'>
        <CommonForm
        formControls ={loginFormControls}
        formData = {formData}
        setFormData = {setFormData}
        buttonText = {"Login Now"}
        onSubmit ={onSubmit}
        />
      </div>
    </div>
  )
}

export default AuthLogin