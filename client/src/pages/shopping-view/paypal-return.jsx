import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { capturePayment } from '@/store/shop/order-slice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const PaypalPaymentReturn = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const tokenId = params.get('token')
    const payerId = params.get('PayerID')
    const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'))

console.log(payerId)
    useEffect(()=>{
        dispatch(capturePayment({tokenId, orderId, payerId})).then((data)=>{
            if(data?.payload?.success){
                sessionStorage.removeItem('currentOrderId');
                window.location.href= '/shop/payment-success'
            }
        })
    }, [payerId, tokenId, dispatch])
    return (
        <Card>
            <CardHeader>
                <CardTitle>Processing Payment...Please wait!</CardTitle>
            </CardHeader>
        </Card>
    )
}

export default PaypalPaymentReturn
