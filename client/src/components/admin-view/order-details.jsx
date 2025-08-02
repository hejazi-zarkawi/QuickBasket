import React, { useState } from 'react'
import { DialogContent, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import CommonForm from '../common/form'
import { useDispatch, useSelector } from 'react-redux'
import { Badge } from '../ui/badge'
import { getAllOrdersForAllUsers, getOrderDetailsForAdmin, updateOrderStatus } from '@/store/admin/order-slice'
import toast from 'react-hot-toast'

const initialState = {
    status: ''
}


const AdminOrderDetailsView = ({ orderDetails }) => {

    const [formData, setFormData] = useState(initialState);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const statusColorMap = {
        pending: "bg-yellow-400",
        confirmed: "bg-green-400",
        inProcess: "bg-blue-400",
        shipping: "bg-indigo-500",
        delivered: "bg-green-500",
        rejected: "bg-red-500",
    };

    const badgeColor = statusColorMap[orderDetails?.orderStatus] || "bg-black";

    function handleUpdateStatus(event) {
        event.preventDefault();
        const { status } = formData;
        dispatch(updateOrderStatus({ id: orderDetails?._id, orderStatus: status })).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(getOrderDetailsForAdmin(orderDetails?._id))
                
                setFormData(initialState);
                dispatch(getAllOrdersForAllUsers())
            }
        })
    }
    return (
        <DialogContent className={" sm:max-w-[600px] max-h-[90vh] overflow-auto "}>
            <DialogTitle>Order Details</DialogTitle>
            <div className='grid gap-6'>
                <div className='grid gap-2 mt-6 space-y-2 px-6'>
                    <div className='flex items-center justify-between'>
                        <p className='font-medium'>Order Id</p>
                        <Label>{orderDetails?._id}</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='font-medium'>Order Date</p>
                        <Label>{orderDetails?.orderDate.split('T')[0]}</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='font-medium'>Order Price</p>
                        <Label>${orderDetails?.totalAmount}</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='font-medium'>Payment Method</p>
                        <Label>{orderDetails?.paymentMethod.toUpperCase()}</Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='font-medium'>Payment Status</p>
                        <Label><Badge className={`py-1 px-2 ${orderDetails?.paymentStatus === "paid" ? 'bg-green-500' : 'bg-black'}`}>{orderDetails?.paymentStatus}</Badge></Label>
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='font-medium'>Order Status</p>
                        <Label>
                            <Badge className={`py-1 px-2 ${badgeColor}`}>{orderDetails?.orderStatus}</Badge>
                        </Label>
                    </div>
                </div>
                <Separator />
                <div className='grid gap-4 space-y-2 px-6'>
                    <div className='grid gap-2'>
                        <div className='font-medium'>Order Details</div>
                        <ul>
                            {
                                orderDetails?.cartItems && orderDetails?.cartItems?.length > 0 ? (
                                    orderDetails.cartItems.map((item) => <li className='flex items-center justify-between'>
                                        <span><span className='font-semibold'>Product Title: </span>{item?.title}</span>
                                        <span><span className='font-semibold'>Quantity: </span>{item?.quantity}</span>
                                        <span><span className='font-semibold'>Price: </span>${item?.price}</span>
                                    </li>)
                                ) : null
                            }

                        </ul>
                    </div>
                </div>

                <div className='grid gap-4 space-y-2 px-6'>
                    <div className='grid gap-2'>
                        <div className='font-medium'>Shipping Info</div>
                        <div className='grid gap-0.5 text-black'>
                            <span><span className='font-semibold'>Customer Name: </span>{user?.userName}</span>
                            <span><span className='font-semibold'>Address: </span>{orderDetails?.addressInfo?.address}</span>
                            <span><span className='font-semibold'>City: </span>{orderDetails?.addressInfo?.city}</span>
                            <span><span className='font-semibold'>Pincode: </span>{orderDetails?.addressInfo?.pincode}</span>
                            <span><span className='font-semibold'>Phone No.: </span>{orderDetails?.addressInfo?.phone}</span>
                            <span><span className='font-semibold'>Additional Notes: </span>{orderDetails?.addressInfo?.notes}</span>
                        </div>
                    </div>
                </div>

                <div className='space-y-2 px-6'>
                    <CommonForm
                        formControls={[
                            {
                                label: "Order Status",
                                name: "status",
                                componentType: "select",
                                options: [
                                    { id: "pending", label: "Pending" },
                                    { id: "inProcess", label: "In Process" },
                                    { id: "inShipping", label: "In Shipping" },
                                    { id: "delivered", label: "Delivered" },
                                    { id: "rejected", label: "Rejected" },
                                ],
                            }
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={"Update Order Status"}
                        onSubmit={handleUpdateStatus}
                    />
                </div>
            </div>
        </DialogContent>
    )
}

export default AdminOrderDetailsView