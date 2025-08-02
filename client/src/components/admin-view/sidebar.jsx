import React from 'react'
import { RiAdminFill } from 'react-icons/ri'
import { MdDashboardCustomize } from 'react-icons/md'
import { AiFillProduct } from 'react-icons/ai'
import { FaCheck } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { SheetContent, SheetHeader, Sheet, SheetTitle, SheetClose } from '../ui/sheet'
import { useLocation } from 'react-router-dom'

import { IoMdClose } from 'react-icons/io'


const adminSidebarMenuItems = [
  {
    id: 'dashboard',
    label: "DashBoard",
    path: "/admin/dashboard",
    icon: <MdDashboardCustomize />
  },
  {
    id: 'products',
    label: "Products",
    path: "/admin/products",
    icon: <AiFillProduct />
  },
  {
    id: 'orders',
    label: "Orders",
    path: "/admin/orders",
    icon: <FaCheck />
  },
]

const MenuItems = ({ setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      {adminSidebarMenuItems.map((item) => {
        const isActive = location.pathname.includes(item.path)
        return (

          <div key={item.id} className={`flex items-center mt-2 lg:mt-0 gap-2 p-2 hover:bg-muted hover:text-foreground  rounded-md cursor-pointer ${isActive ? 'bg-muted text-foreground':'text-muted-foreground'}`} onClick={() => {
            navigate(item.path)
            setOpen ? setOpen(false) : null
          }}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        )})}
    </div>
  )}
  

const AdminSideBar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side='left' className="w-64">
          <div className='flex flex-col h-full p-4'>
            <SheetHeader className="border-b">
              <SheetTitle>
                <div className='flex items-center gap-2 mb-4 cursor-pointer' onClick={() => {
                  navigate('/admin/dashboard')
                  setOpen(false)
                }}>
                  <RiAdminFill strokeWidth={1} size={20} />
                  <h1 className='font-bold text-lg'>Admin Panel</h1>
                </div>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>

        </SheetContent>
      </Sheet>
      <aside className="w-64 hidden lg:flex bg-background border-r-2 flex-col p-4 pl-8">
        <div className='flex items-center gap-2 mb-6 cursor-pointer' onClick={() => navigate('/admin/dashboard')}>
          <RiAdminFill strokeWidth={1} size={20} />
          <h1 className='font-bold text-lg'>Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </>
  )
}

export default AdminSideBar