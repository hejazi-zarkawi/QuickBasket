
import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import UserCartItemsContent from './cart-items-content'
import { useNavigate } from 'react-router-dom'

const UserCartWrapper = ({cartItems, setOpenCartSheet}) => {

  const navigate = useNavigate();

   const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <>
    <SheetContent side='right' className={"p-4 !max-w-[90%] lg:!max-w-[30%] overflow-auto"}>
        <SheetHeader >
            <SheetTitle className={"text-xl font-bold"}>Your Cart</SheetTitle>
        </SheetHeader>
        <div className='mt-8 space-y-4'>
          {
            cartItems && cartItems.length > 0 ?
            cartItems.map((item) => <UserCartItemsContent key={item.id} cartItem = {item} /> ) : <p className='text-xl font-semibold p-4 '>Your Cart is Empty!!!</p>
          }
        </div>
        <div className='mt-8 space-y-4'>
            <div className='flex items-center justify-between'>
                <span className='font-semibold'>Total Amount</span>
                <span className='font-semibold'>${totalCartAmount.toFixed(2)}</span>
            </div>
        </div>
        <Button  onClick={()=> {navigate("/shop/checkout")
          setOpenCartSheet(false)}
        } className={"w-full cursor-pointer mt-6"}>Checkout</Button>

        </SheetContent>
    </>
  )
}

export default UserCartWrapper