import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { set } from 'lodash'

const AdminProductTile = ({product, setFormData, setCurrentEditedId, setOpenAddProductDialog, handleDelete}) => {
  return (
    <Card className="w-full p-4 max-w-sm mx-auto">
        <div>
            <div className='relative'>
                <img src={product?.image} alt={product?.title} className='w-full h-[300px] object-cover rounded-t-lg' />
            </div>
            <CardContent>
                <h2 className='text-xl font-bold mb-2 mt-2'>{product?.title}</h2>
                <div className='flex items-center justify-between mb-2'>
                    <span className={`${product?.salePrice > 0 ? 'line-through': ""} text-lg font-semibold text-primary`}>${product?.price}</span>
                    {
                        product?.salePrice > 0 && <span className='text-lg font-bold'>${product?.salePrice}</span>
                    }
                    
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Button onClick={()=>{
                    setOpenAddProductDialog(true);
                    setFormData(product);
                    setCurrentEditedId(product._id);
                }} className={"cursor-pointer"}>Edit</Button>
                <Button onClick={()=> handleDelete(product._id)} className={"cursor-pointer"}>Delete</Button>
            </CardFooter>
        </div>
    </Card>
  )
}

export default AdminProductTile