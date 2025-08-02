import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '../ui/dialog'
import ShoppingOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/shop/order-slice'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const ShoppingOrders = () => {

  const [activeOrderId, setActiveOrderId] = useState(null);
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder)

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId)).then((data) => {
        setActiveOrderId(getId)
    })
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id)).then((data) => {

    })
  }, [dispatch])

  // useEffect(() => {
  //   if (orderDetails !== null) setOpenDialogDetails(true);
  // }, [orderDetails])

  // console.log(orderDetails, "orderDetails")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className='sr-only'>Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => <TableRow>
                  <TableCell>{orderItem?._id}</TableCell>
                  <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                  <TableCell>
                    <Badge className={`py-1 px-2 ${orderItem?.orderStatus === "pending" ? "bg-yellow-400" : ""}
    ${orderItem?.orderStatus === "confirmed" ? "bg-green-400" : ""}
    ${orderItem?.orderStatus === "inProcess" ? "bg-blue-400" : ""}
    ${orderItem?.orderStatus === "shipping" ? "bg-indigo-500" : ""}
    ${orderItem?.orderStatus === "delivered" ? "bg-green-500" : ""}
    ${orderItem?.orderStatus === "rejected" ? "bg-red-500" : ""}
    ${!["pending", "confirmed", "inProcess", "shipping", "delivered", "rejected"].includes(
                      orderItem?.orderStatus
                    )
                        ? "bg-black"
                        : ""
                      }`}>{orderItem?.orderStatus}</Badge>
                  </TableCell>
                  <TableCell>${orderItem?.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog  open={activeOrderId === orderItem._id} onOpenChange={(isOpen) => {
    if (!isOpen) {
      setActiveOrderId(null);
      setTimeout(() => dispatch(resetOrderDetails()), 200);
    }
  }}>
                      <DialogTrigger asChild>
                        <Button onClick={() => handleFetchOrderDetails(orderItem?._id)} className={"cursor-pointer"}>Order Details</Button>
                      </DialogTrigger>
                    
                      <ShoppingOrderDetailsView key={orderItem?._id} orderDetails={orderDetails} />
                    </Dialog>

                  </TableCell>
                </TableRow>)
              ) : <p className='text-lg font-semibold'>No Orders to show. Buy Some items !!!</p>
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ShoppingOrders