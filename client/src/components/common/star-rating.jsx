import React from 'react'
import { Button } from '../ui/button'
import { FaStar } from "react-icons/fa";

const StarRatingComponent = ({rating , handleRatingChange}) => {
  return (

    <div className='flex gap-4 items-center'>
        <div>
    {
      [1,2,3,4,5].map((star)=>
        <Button  className={`p-1 rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "text-black hover:bg-primary hover:primary-foreground"
      }`} variant={"ouline"} size="icon"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
       >
            <FaStar className={`w-6 h-6 ${
          star <= rating ? "fill-yellow-500" : "fill-black"
        }`} />
        </Button>
        
      )} </div><p className='px-1 border border-black  font-bold'>{rating}/5</p></div> 

  )
}

export default StarRatingComponent
