import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSideBar from './sidebar.jsx'
import AdminHeader from './header.jsx'
import { useState } from 'react'

const AdminLayout = () => {

  const [openSidebar, setOpenSidebar] = useState(false)
  return (
    <div className='flex min-h-screen w-full '>
        {/* Admin Sidebar */}
        <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
        <div className='flex border border-l-2 flex-1 flex-col'>
            {/* Admin Header */}
            <AdminHeader setOpen={setOpenSidebar} />
            <main className='flex-1 flex bg-muted p-4 md:p-6'>
                <Outlet/>
            </main>

        </div>
    </div>
  )
}

export default AdminLayout