import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Button } from '@/components/ui/button'
import { FiLogOut } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { logoutUser, resetTokenAndCredentials } from '@/store/auth-slice'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AdminHeader = ({setOpen}) => {

  const dispatch = useDispatch();
  const navigate= useNavigate()

  const handleLogout = ()=>{

    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if(!confirmLogout) return;
    // dispatch(logoutUser()).then((data)=>{
    //   if(data?.payload?.success){
    //     toast.success(data?.payload?.message);
    //   }
    //   else{
    //     toast.error(data?.payload?.message);
    //   }
    // })
    dispatch(resetTokenAndCredentials());
    toast.success("User Logged Out Successfully!!!")
    sessionStorage.clear();
    navigate("/auth/login")
  }
  return (
    <header className='flex bg-background items-center justify-between p-4 pl-8 '>
      <Button className="block lg:hidden cursor-pointer" onClick={() => setOpen(true)}>
      <GiHamburgerMenu />
      </Button>
      <div className='flex flex-1 justify-end pr-8'>
      <Button onClick={handleLogout} className="flex items-center justify-center cursor-pointer">
      <FiLogOut strokeWidth={3}/>
      <span className='font-semibold'>Logout</span>
      </Button>
      </div>
    </header>
  )
}

export default AdminHeader