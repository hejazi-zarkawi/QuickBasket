import ProductFilter from '@/components/shopping-view/ProductFilter'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '../../components/ui/dropdown-menu'
import { LuArrowUpDown } from "react-icons/lu";
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { sortOptions } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import toast, { ToastBar } from 'react-hot-toast';


const ShoppingListing = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const { productsList, isLoading, productDetails } = useSelector((state) => state.shopProducts);

  const {user} = useSelector((state) => state.auth);
  const {cartItems} = useSelector((state)=> state.shopCart)
  
  const [sort, setSort] = useState(null);
  const [filter, setfilter] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const categorySearchParam = searchParams.get('category')

  const handleSort = (value) => {
    setSort(value);
    
  }

  function createSearchParamsHelper(filter) {
    let queryParams = [];

    for (const [key, value] of Object.entries(filter)) {
      if (Array.isArray(value) && value.length > 0) {
        let paramValue = value.join(',')
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    // console.log(queryParams, "queryParams");

    return queryParams.join("&");
  }

  function handleFilter(getSectionId, getOptionId) {
    let cpyFilters = { ...filter };
    let indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getOptionId]
      }
    } else {
      let indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getOptionId);

      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getOptionId);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    setfilter(cpyFilters);
    sessionStorage.setItem("filter", JSON.stringify(cpyFilters));
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

  useEffect(() => {
    setSort('price-lowtohigh');
    setfilter(JSON.parse(sessionStorage.getItem("filter")) || {});
  }, [categorySearchParam])

  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {
      const createSearchQuery = createSearchParamsHelper(filter);
      setSearchParams(new URLSearchParams(createSearchQuery));
    }
  }, [filter])


  useEffect(() => {
    if(filter !== null && sort !== null) {
    dispatch(fetchAllFilteredProducts({filterParams : filter, sortParams: sort})).then((data) => {
      if (data?.payload?.success) {
        console.log("Products fetched successfully:", data.payload.data);
      } else {
        console.error("Failed to fetch products:", data.payload.message);
      }
    })}
  }, [dispatch, filter, sort])

    // console.log(productsList, "productsListproductsListproductsList")

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6'>
        <ProductFilter filter={filter} handleFilter={handleFilter} />
        <div className='bg-background rounded-lg shadow-sm w-full'>
          <div className='p-4 border-b flex items-center justify-between'>
            <h2 className='text-lg font-bold'>All Products</h2>
            <div className='flex items-center gap-3'>
              <span className='text-muted-foreground'>{productsList.length} Products</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className={"cursor-pointer flex items-center gap-1"}>
                    <LuArrowUpDown className='mr-2' />
                    Sort By
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-[200px]' align='end' >
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {
                      sortOptions.map((option) => <DropdownMenuRadioItem value={option.id} className={"cursor-pointer"} key={option.id}>{option.label}</DropdownMenuRadioItem>)
                    }
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className='flex items-center justify-center h-screen'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
              </div>
            ) : (
              productsList && productsList.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                  {productsList.map((product) => {
                    return <ShoppingProductTile key={product._id} handleGetProductDetails= {handleGetProductDetails} product={product} handleAddtoCart={handleAddtoCart} />
                  })}
                </div>
              ) : <div className='p-4 text-center'>No products found.</div>)}
          </div>
        </div>
        <ProductDetailsDialog open= {open} setOpen= {setOpen} productDetails= {productDetails} />
      </div>
    </>
  )
}

export default ShoppingListing