import React, { useState } from 'react'
import img from "../../assets/checkout1.webp"
import Address from '@/components/shopping-view/address'
import UserCartItemsContent from '@/components/shopping-view/cart-items-content'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { createNewOrder } from '@/store/shop/order-slice'
import toast from 'react-hot-toast'

const ShoppingCheckout = () => {

  const { cartItems } = useSelector((state) => state.shopCart)
  const { user } = useSelector((state) => state.auth)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [isPageBlocked, setIsPageBlocked] = useState(false);
  const {approvalURL} = useSelector((state)=> state.shopOrder)

  const dispatch = useDispatch();

  // console.log(cartItems," CartItems from checkout")

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
        (sum, currentItem) =>
          sum +
          (currentItem?.salePrice > 0
            ? currentItem?.salePrice
            : currentItem?.price) *
          currentItem?.quantity,
        0
      )
      : 0;

      // console.log(currentSelectedAddress, "current Selected Address")

  function handleInitiatePaypalPayment() {



    if(!cartItems?.items || cartItems.items.length === 0){
      toast.error("Your cart is empty. Please add some items.")
      return;
    }

    if(!currentSelectedAddress){
      toast.error("Please select one address to proceed.")
      return;
    }

    setIsPageBlocked(true);
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data)=>{
      console.log(data, "Created Order")
      if(data?.payload?.success){
        setIsPaymentStart(true);
      }
      else{
        setIsPaymentStart(false);
      }
      
    })
  }

  if(approvalURL){
    window.location.href = approvalURL;
  }

  return (
    <div className=''>
    <div className='flex flex-col'>
      <div className='relative h-[350px] w-full overflow-hidden'>
        <img src={img} className='w-full h-full object-cover object-center' />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 p-4'>
        <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className='flex flex-col'>
          <div className='p-4 pr-8 space-y-4'>
            {
              cartItems && cartItems.items && cartItems.items.length > 0 ? (cartItems.items.map((item) => <UserCartItemsContent cartItem={item} />)) : <p className='font-bold text-xl'>Ooops!!! Your Cart is Empty. Please add some items.</p>
            }
          </div>
          <div className='flex items-center justify-between p-4 pr-8'>
            <span className='font-semibold'>Total Amount</span>
            <span className='font-semibold'>${totalCartAmount.toFixed(2)}</span>
          </div>
          <div className='w-full mt-3'>
            <Button onClick={handleInitiatePaypalPayment} className={"bg-gradient-to-r from-[#003087] to-[#0070ba] text-white hover:opacity-90 w-full cursor-pointer"}>Checkout with Paypal</Button>
          </div>
        </div>
      </div>
    </div>

    {isPageBlocked && (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-10 cursor-not-allowed flex items-center justify-center">
      <span className="text-white text-xl font-semibold">Redirecting to PayPal...</span>
    </div>
  )}
    </div>
  )
}

export default ShoppingCheckout