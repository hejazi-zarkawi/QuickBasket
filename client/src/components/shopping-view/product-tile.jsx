import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const ShoppingProductTile = ({ product, handleGetProductDetails, handleAddtoCart }) => {
    return (
        <>
            <Card className="w-full max-w-sm mx-auto p-4">
                <div className='cursor-pointer' onClick={() => handleGetProductDetails(product._id)}>
                    <div className='relative '>
                        <img src={product?.image} alt={product?.title} className='w-full h-[300px] rounded-t-lg object-cover' />
                        {
                            product.totalStock === 0 ? (<Badge className='absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white'>
                                Out Of Stock!
                            </Badge>): product.totalStock < 10 ? (<Badge className='absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white'>
                                {`Only ${product.totalStock} item${product.totalStock === 1 ? '' : 's'} left`}
                            </Badge>):
                            product?.salePrice > 0 ?
                            <Badge className='absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white'>
                                Sale
                            </Badge> : null
                        }
                    </div>
                    <CardContent className={"p-4"}>
                        <h2 className='text-xl font-bold mb-2'>{product?.title}</h2>
                        <div className='flex items-center justify-between mb-2'>
                            <Badge variant='outline'>{product.category[0].toUpperCase()+ product.category.slice(1)}</Badge>
                            <Badge variant='outline'>{product.brand[0].toUpperCase()+ product.brand.slice(1)}</Badge>
                        </div>
                        <div className='flex items-center justify-between mb-2'>
                            <span className={`${product.salePrice> 0 ? "line-through": " "} text-lg font-semibold text-primary`}>${product.price}</span>
                            {
                            product?.salePrice > 0 &&
                            <span className='text-lg font-bold text-primary'>${product.salePrice}</span>
                        }
                        </div>
                    </CardContent>
                    <CardFooter>
                        {
                            product.totalStock === 0 ? (<Button onClick ={(event)=> {
                            event.stopPropagation();}} className={'w-full cursor-not-allowed opacity-40'}>
                            Out Of Stock
                        </Button>): (<Button onClick ={(event)=> {
                            event.stopPropagation();
                            handleAddtoCart(product?._id, product?.totalStock)}} className={'w-full cursor-pointer'}>
                            Add to Cart
                        </Button>)
                        }
                        
                    </CardFooter>
                </div>
            </Card>
        </>
    )
}

export default ShoppingProductTile