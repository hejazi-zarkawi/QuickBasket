import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog, DialogOverlay, DialogTrigger } from '../ui/dialog'
import AdminOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAllUsers, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice'
import { Badge } from '../ui/badge'

const AdminOrdersView = () => {
    const [activeOrderId, setActiveOrderId] = useState(null);
    const { orderList, orderDetails } = useSelector((state) => state.adminOrder)
    const dispatch = useDispatch()

    

    useEffect(() => {
        dispatch(getAllOrdersForAllUsers()).then((data) => {

        })
    }, [dispatch])

    // useEffect(() => {
    //     if (orderDetails !== null) setOpenDialogBox(true)
    // }, [orderDetails])

    function handleFetchOrderDetailsForAdmin(getId) {
        dispatch(getOrderDetailsForAdmin(getId)).then((data) => {
            setActiveOrderId(getId);
        })
    }

    console.log(orderDetails, "OrderDetails")

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
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
    ${
      !["pending", "confirmed", "inProcess", "shipping", "delivered", "rejected"].includes(
        orderItem?.orderStatus
      )
        ? "bg-black"
        : ""
    } `}>{orderItem?.orderStatus}</Badge>
                                    </TableCell>
                                    <TableCell>${orderItem?.totalAmount}</TableCell>
                                    <TableCell>
                                        <Dialog 
                                            open={activeOrderId === orderItem._id}
                                             onOpenChange={(isOpen) => {
    if (!isOpen) {
      setActiveOrderId(null);
      setTimeout(() => dispatch(resetOrderDetails()), 200);
    }
  }}
                                        >
                                            <Button
                                                onClick={() => handleFetchOrderDetailsForAdmin(orderItem?._id)}
                                                className={"cursor-pointer"}>Order Details</Button>
                                            <AdminOrderDetailsView orderDetails={orderDetails} />
                                        </Dialog>
                                    </TableCell>
                                </TableRow>)
                            ) : (<TableRow>
                                <TableCell colSpan={"100%"} className="text-center py-4 text-lg font-semibold">
                                    No Orders to show. Buy some items !!!
                                </TableCell>
                            </TableRow>)
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default AdminOrdersView