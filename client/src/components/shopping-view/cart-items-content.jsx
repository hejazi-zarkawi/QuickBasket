import { deleteCartItem, updateCartItemQty } from '@/store/shop/cart-slice';
import React, { useCallback } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdDelete } from 'react-icons/md';
import { Button } from '../ui/button';

const UserCartItemsContent = ({cartItem}) => {
  const { user } = useSelector((state) => state.auth);
  const {cartItems} = useSelector((state)=> state.shopCart)
  const { productsList} = useSelector((state) => state.shopProducts);
  
  const dispatch = useDispatch();


  function handleUpdateQuantity(getCartItem, typeOfAction) {

    if(typeOfAction === 'plus'){
      let getCartItems = cartItems?.items || []

    if (getCartItems.length) {
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item.productId === getCartItem?.productId
      );

      const indexofCurrentProductItem = productsList.findIndex((product) => product._id === getCartItem?.productId )

      const getTotalStock = productsList[indexofCurrentProductItem].totalStock
      if (indexOfCurrentCartItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this item`)
          return;
        }
      }
    }
    }
    dispatch(
      updateCartItemQty({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart Item is updated successfully")
      }else{
        console.log(data.payload.message)
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item is deleted successfully")
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-bold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            className="h-6 w-6 cursor-pointer rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <FaMinus className="w-2 h-2" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-6 cursor-pointer w-6 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <FaPlus className="w-2 h-2" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <MdDelete
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}


export default UserCartItemsContent