import ProductDetailsDialog from '@/components/shopping-view/product-details'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { Input } from '@/components/ui/input'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { fetchProductDetails } from '@/store/shop/products-slice'
import { getSearchResults, resetSearch } from '@/store/shop/search-slice'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'

const SearchProducts = () => {

    const [keyword, setKeyword] = useState("")
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch();
    const {searchResults} = useSelector((state)=> state.shopSearch)
    const {cartItems} = useSelector((state)=> state.shopCart)
    const { productDetails } = useSelector((state) => state.shopProducts);
    const [open, setOpen] = useState(false);
    const {user} = useSelector((state)=> state.auth)

    function handleAddtoCart(getCurrentProductId, getTotalStock){

    let getCartItems = cartItems?.items || []

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this item`)
          return;
        }
      }
    }

    dispatch(addToCart({ userId : user.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        toast.success("Product is added to cart")
        dispatch(fetchCartItems(user?.id)).then((data) =>{
          if(data?.payload?.success){            
          }
          else {
            console.error("Failed to fetch cart Items:", data.payload.message);
          }
        } 
        
      )
      } else {
        console.error("Failed to add product to cart:", data.payload.message);
      }
    })
  }

  function handleGetProductDetails(productId){
      dispatch(fetchProductDetails(productId)).then((data) =>{
        if (data?.payload?.success) {
          setOpen(true);
        } else {
          console.error("Failed to fetch product details:", data.payload.message);
        }
      })
    }
    
    useEffect(()=>{
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
        if(keyword && keyword.trim()){
           const handler = setTimeout(()=>{
                dispatch(getSearchResults(keyword))
               
            },1500)

            return (()=> clearTimeout(handler))
        }
        else{  
            dispatch(resetSearch())
        }
    },[keyword])


  return (
    <div className='container mx-auto md:px-6 px-4 py-8'>
      <div className='flex justify-center mb-8'>
        <div className={`w-full flex items-center `}>
            <Input value={keyword} name="keyword" onChange={(event)=> setKeyword(event.target.value)}  className={"py-6"} placeholder="Search Products" />
        </div>
      </div>
      <div className='text-xl font-bold'>Search Results</div>
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {
            searchResults && searchResults.length > 0 ? (
                searchResults.map((item)=> <ShoppingProductTile key={item._id} handleAddtoCart={handleAddtoCart} handleGetProductDetails={handleGetProductDetails} product={item} />)
            ) : <h1 className='text-lg font-semibold'>No products found!!!</h1>
        }
      </div>

      <ProductDetailsDialog open= {open} setOpen= {setOpen} productDetails= {productDetails} />
      
    </div>
  )
}

export default SearchProducts
