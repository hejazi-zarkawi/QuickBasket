import React, { useEffect } from 'react'
import accImg from "../../assets/account.jpg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Orders from '@/components/shopping-view/orders'
import Address from '@/components/shopping-view/address'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllAddresses } from '@/store/shop/address-slice'
import ShoppingOrders from '@/components/shopping-view/orders'
import { getAllOrdersByUserId } from '@/store/shop/order-slice'

const ShoppingAccount = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state)=> state.auth)
  useEffect(() => {
      dispatch(getAllOrdersByUserId(user?.id)).then((data) => {
  
      })
    }, [dispatch])
  return (
    <div className='flex flex-col'>
      <div className='relative h-[300px] w-full overflow-hidden'>
        <img src={accImg} 
             className='w-full h-full object-cover object-center'    
        />
      </div>
      <div className='container mx-auto grid grid-cols-1 gap-8 py-8'>
        <div className='flex flex-col rounded-lg border bg-background p-6 shadow-md'>
            <Tabs defaultValue="orders">
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
              </TabsList>
              <TabsContent value="orders">
                      <ShoppingOrders />
              </TabsContent>
              <TabsContent value="address">
                      <Address />
              </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  )
}

export default ShoppingAccount