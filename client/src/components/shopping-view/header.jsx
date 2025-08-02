import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { MdHome } from "react-icons/md";
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { GiHamburgerMenu } from "react-icons/gi";
import { shoppingViewHeaderMenuItems } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart } from "react-icons/fa";
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger, Label } from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '../ui/dropdown-menu';
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from 'react-icons/fi';
import { logoutUser, resetTokenAndCredentials } from '@/store/auth-slice';
import toast from 'react-hot-toast';
import UserCartWrapper from './cart-wrapper';
import { fetchCartItems } from '@/store/shop/cart-slice';
import { get } from 'lodash';
import QuickBasket from "../../assets/QuickBasket.png"

function MenuItems() {

  const navigate = useNavigate()
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentItem){
    sessionStorage.removeItem('filter');
    const currFilter = getCurrentItem.id !== "home" && getCurrentItem.id !== "products" && getCurrentItem.id !== "search"  ? 
    {
      category : [getCurrentItem.id]
    } : null

    sessionStorage.setItem('filter', JSON.stringify(currFilter));

    location.pathname.includes("listing") && currFilter!== null ?
    setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`)):
    navigate(getCurrentItem.path)
  }
  return (
    <nav className='flex flex-col mb-3 lg:mb-0 lg:flex-row lg:items-center gap-6'>
      {shoppingViewHeaderMenuItems.map((item) =>
        <Label className='cursor-pointer' onClick={()=> handleNavigate(item)}
          key={item.id} 
          to={item.path}>
            {item.label}
        </Label>
      )}
    </nav>
  )
}

function RightMenuHeader() {

  const { cartItems } = useSelector((state) => state.shopCart)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const handleLogout = () => {

    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    // dispatch(logoutUser()).then((data) => {
    //   if (data?.payload?.success) {
    //     toast.success(data?.payload?.message);
    //   }
    //   else {
    //     toast.error(data?.payload?.message);
    //   }
    // })
    dispatch(resetTokenAndCredentials());
    toast.success("User Logged Out Successfully!!!")
    sessionStorage.clear();
    navigate("/auth/login")
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id)).then((data) => {
      if (data?.payload?.success) {
        console.log("Fetched data", data)
      }
      else {
        
      }
    })
  }, [dispatch])

  return (
    <div className='flex flex-col lg:flex-row lg:items-center gap-4'>

      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>

        <Button onClick={() => setOpenCartSheet(true)} variant='outline' size='icon' className={"cursor-pointer relative"} >
          <FaShoppingCart className='h-6 w-6' />
          <span className='absolute top-[-8px] right-0 text-sm font-bold'>{cartItems?.items?.length || '0'}</span>
          <span className='sr-only'>Cart</span>
        </Button>
        <UserCartWrapper cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} setOpenCartSheet={setOpenCartSheet} />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className='bg-black cursor-pointer rounded-full h-7 w-7'>
            <AvatarFallback className='text-xs font-semibold text-white flex items-center justify-center pt-1.5'>
              {user?.userName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' className='w-56'>
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={"cursor-pointer"} onClick={() => navigate('/shop/account')}>
            <FaRegUserCircle className='h-5 w-5 mr-2 text-black font-semibold' />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem className={"cursor-pointer"} onClick={handleLogout}>
            <FiLogOut className='h-5 w-5 mr-2 text-black font-semibold' />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

const ShoppingHeader = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background p-4 md:p-6'>
      <div className='flex h-5 items-center justify-between'>
        <Link to='/shop/home' className='flex items-center  '>
          <img src={QuickBasket} width={69} height={69} />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon' className="lg:hidden cursor-pointer">
              <GiHamburgerMenu className='h-6 w-6' />
              <span className='sr-only'>Toggle header Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className={"w-64 max-w-xs p-8"}>
            <MenuItems />
            <RightMenuHeader />
          </SheetContent>
        </Sheet>
        <div className='hidden lg:block'>
          <MenuItems />
        </div>
        <div className='hidden lg:block'>
          {isAuthenticated ? <RightMenuHeader /> : null}
        </div>
      </div>
    </header>
  )
}

export default ShoppingHeader