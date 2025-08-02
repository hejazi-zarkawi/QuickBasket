import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { FaStar } from "react-icons/fa";
import { Input } from '../ui/input'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Label } from '../ui/label'
import StarRatingComponent from '../common/star-rating'
import { addReview, getReviews } from '@/store/shop/review-slice'

const ProductDetailsDialog = ({ open, setOpen, productDetails }) => {

    const dispatch = useDispatch();
    const [reviewMsg, setReviewMsg] = useState("");
    const [rating, setRating] = useState(0);
    const { user } = useSelector((state) => state.auth)
    const { cartItems } = useSelector((state) => state.shopCart)
    const { reviews } = useSelector((state) => state.shopReview)

    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      reviews.length;

    function handleAddReview() {
        dispatch(addReview({
            productId: productDetails?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating,
        })).then((data)=>{
            if(data?.payload?.success){
                dispatch(getReviews(productDetails?._id))
                toast.success(data?.payload?.message)
                setReviewMsg("");
                setRating(0)
            }
            else{
                toast.error(data?.payload?.message)
            }
        })
    }

    function handleRatingChange(getRating) {
        setRating(getRating);
    }

    useEffect(()=>{
        if(productDetails !== null){
            dispatch(getReviews(productDetails?._id))
        }
    },[productDetails])

    function handleAddtoCart(getCurrentProductId, getTotalStock) {

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
        dispatch(addToCart({ userId: user.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
            if (data?.payload?.success) {
                toast.success("Product is added to cart")
                dispatch(fetchCartItems(user?.id)).then((data) => {
                    if (data?.payload?.success) {
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

    // console.log(reviews, "Reviews")
    return (
        <Dialog open={open} onOpenChange={()=>{
            setOpen(false);
            setReviewMsg("");
            setRating(0);
        }}>
            <DialogContent className="grid grid-cols-2 gap-8   sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[60vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        width={600}
                        height={600}
                        className="aspect-square w-full object-cover"
                    />
                    <div className=' mt-16 pl-16 flex flex-col fixed gap-2'>
                        <Label className={"font-semibold text-lg "}  >Write a Review</Label>
                        <div>
                            <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                        </div>
                        <div className='flex gap-2'>
                            <Input name="reviewMsg" value={reviewMsg} onChange={(event) => setReviewMsg(event.target.value)} placeholder="Write a review..." />
                            <Button onClick={handleAddReview} disabled={reviewMsg.trim() === ""} className=" cursor-pointer">Submit</Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">
                            {productDetails?.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p
                            className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""
                                }`}
                        >
                            ${productDetails?.price}
                        </p>
                        {productDetails?.salePrice > 0 ? (
                            <p className="text-2xl font-bold text-muted-foreground">
                                ${productDetails?.salePrice}
                            </p>
                        ) : null}
                    </div>
                    <div className='flex items-center gap-2'>
                        <StarRatingComponent rating={averageReview} />
                        <span className='text-muted-foreground'>{averageReview.toFixed(2)}</span>
                    </div>
                    <div className='mt-5 mb-5'>
                        {
                            productDetails?.totalStock === 0 ? (
                                <Button className="w-full cursor-not-allowed opacity-40">Add to Cart</Button>
                            ) : <Button onClick={() => handleAddtoCart(productDetails._id, productDetails?.totalStock)} className="w-full cursor-pointer">Add to Cart</Button>
                        }

                    </div>
                    <Separator />
                    <div className='min-h-[300px] max-h-[301px] overflow-y-auto pr-2'>
                        <h2 className='text-xl font-bold mb-4'>Reviews</h2>
                        <div className='grid gap-4'>
                            {
                                reviews && reviews.length > 0 ? (
                                    reviews.map((reviewItem)=>
                                    <div className='flex gap-4'>
                                <Avatar className={"w-10 h-10 border"}>
                                    <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className='grid gap-1'>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='font-bold'>{reviewItem?.userName}</h3>
                                    </div>
                                    <div className='flex items-center gap-0.5'>
                                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                                    </div>
                                    <div>
                                        <p className='text-muted-foreground'>{reviewItem?.reviewMessage}</p>
                                    </div>
                                </div>
                            </div>)
                                ): <h1 className='text-lg font-semibold'>No review available for this product.</h1>
                            }
                            
                        </div>

                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialog