import { filterOptions } from '@/config'
import React, { Fragment } from 'react'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'

const ProductFilter = ({filter, handleFilter}) => {
  return (
    <div className='bg-background rounded-lg shadow-sm'>
        <div className='border-b p-4'>
            <h2 className='text-lg font-bold'>Filter Products</h2>
            <Separator />
            <div className='p-4 space-y-4'>
                {
                    Object.keys(filterOptions).map((key)=>{
                        return(
                            <Fragment key={key}>
                                <div>
                                    <h3 className='text-base font-semibold'>{key[0].toUpperCase()+ key.slice(1)}</h3>
                                    <div className='grid gap-2 mt-2'>
                                        {
                                            filterOptions[key].map((item) =>{
                                                return(
                                                    <Label key={item.id} className={"flex items-center gap-2 cursor-pointer text-medium "}>
                                                        <Checkbox 
                                                        checked ={
                                                            filter && filter[key] && filter[key].includes(item.id)
                                                        }
                                                        onCheckedChange={()=>handleFilter(key, item.id)} />
                                                        <span>{item.label}</span>
                                                    </Label>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <Separator />
                            </Fragment>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default ProductFilter