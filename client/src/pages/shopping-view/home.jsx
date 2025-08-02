import React, { useEffect, useState } from 'react'
import BannerOne from '../../assets/banner-1.webp'
import BannerTwo from '../../assets/banner-2.webp'
import BannerThree from '../../assets/banner-3.webp'
import { Button } from '@/components/ui/button'
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { FcBusinessman } from "react-icons/fc";
import { FcBusinesswoman } from "react-icons/fc";
import { MdChildCare } from "react-icons/md";
import { IoWatch } from "react-icons/io5";
import { GiConverseShoe } from "react-icons/gi";
import { Card, CardContent } from '@/components/ui/card'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { SiAdidas, SiNike, SiPuma, SiZara } from "react-icons/si";
import { GiClothes } from "react-icons/gi";
import { IoIosShirt } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import toast from 'react-hot-toast'
import { getFeatureImages } from '@/store/common-slice'

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: FcBusinessman },
  { id: "women", label: "Women", icon: FcBusinesswoman },
  { id: "kids", label: "Kids", icon: MdChildCare },
  { id: "accessories", label: "Accessories", icon: IoWatch },
  { id: "footwear", label: "Footwear", icon: GiConverseShoe },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: SiNike },
  { id: "adidas", label: "Adidas", icon: SiAdidas },
  { id: "puma", label: "Puma", icon: SiPuma },
  { id: "levi's", label: "Levi's", icon: GiClothes },
  { id: "zara", label: "Zara", icon: SiZara },
  { id: "h&M", label: "H&M", icon: IoIosShirt },
];

const ShoppingHome = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { productsList, productDetails } = useSelector((state) => state.shopProducts)
  const {user} = useSelector((state) => state.auth)
  
  const [currentSlide, setCurrentSlide] = useState(0)
  const [open, setOpen] = useState(false);
  const {featureImageList} = useSelector((state)=> state.commonFeature)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
    }, 5000)

    return (() => {
      clearInterval(timer)
    })
  }, [featureImageList])

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }))
  }, [dispatch])

  function handleNavigateToListingPage(getCurrentItem, section){
    sessionStorage.removeItem('filter');

    const currFilter ={
      [section]: [getCurrentItem]
    }

    sessionStorage.setItem("filter", JSON.stringify(currFilter))
    
    navigate('/shop/listing');
  }

  function handleAddtoCart(getCurrentProductId){
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

  // console.log(productsList, "productsList")

  useEffect(()=>{
      dispatch(getFeatureImages())
    },[dispatch])

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='relative w-full h-[600px] overflow-hidden'>
        {
          featureImageList && featureImageList.length>0 ? featureImageList.map((slide, index) => (
            <img src={slide?.image} key={index} className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`} />
          )) : null
        }

        <Button onClick={() => { navigate('/shop/listing') }} variant="outline"  className={"absolute top-[70%] left-[10%] font-bold bg-red-400 text-xl px-6 py-3 cursor-pointer rounded-lg shadow-md"}>
          Go to Collections
        </Button>
        <Button onClick={() => { setCurrentSlide((prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length) }} variant="outline" size="icon" className={"cursor-pointer absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"}>
          <GoChevronLeft className='h-4 w-4' />
        </Button>

        <Button onClick={() => { setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length) }} variant="outline" size="icon" className={"cursor-pointer absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"}>
          <GoChevronRight className='h-4 w-4' />
        </Button>
      </div>
      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card onClick={()=> handleNavigateToListingPage(categoryItem.id, "category")} key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-2">
                  <categoryItem.icon className="w-12 h-12 mb-2 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-12 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card key={brandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent onClick={()=> handleNavigateToListingPage(brandItem.id, "brand")} className="flex flex-col items-center justify-center p-2">
                  <brandItem.icon className="w-12 h-12 mb-2 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>Featured Products</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 '>
            {
              productsList && productsList.length > 0 ?
                productsList.map((productItem) => <ShoppingProductTile handleGetProductDetails={handleGetProductDetails} handleAddtoCart={handleAddtoCart} key={productItem._id} product={productItem} />) : null
            }
          </div>
        </div>
      </section>

      <ProductDetailsDialog open= {open} setOpen= {setOpen} productDetails= {productDetails} />
    </div>
  )
}

export default ShoppingHome