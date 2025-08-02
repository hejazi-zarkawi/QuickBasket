import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import CommonForm from '../common/form'
import { addressFormControls } from '@/config'
import { useDispatch, useSelector } from 'react-redux'
import { addNewAddress, deleteAddress, editAddress, fetchAllAddresses } from '@/store/shop/address-slice'
import AddressCard from './address-card'
import toast from 'react-hot-toast'


const initialAddressFormData = {
    address: '',
    city: "",
    pincode: "",
    phone: "",
    notes: "",
}


const Address = ({setCurrentSelectedAddress, selectedId}) => {

    const [formData, setFormData] = useState(initialAddressFormData)
    const [currentEditedId, setCurrentEditedId] = useState(null)
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth)
    const { addressList } = useSelector((state) => state.shopAddress)

    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id))
    }, [dispatch])

    function handleManageAddress(event) {
        event.preventDefault();

        if(addressList.length >= 3 && currentEditedId === null){
            toast.error("You can add maximum 3 address!!!")
            return ;
        }

        if (currentEditedId !== null) {
            dispatch(editAddress({ userId: user?.id, addressId: currentEditedId, formData: formData })).then((data) => {
                if (data?.payload?.success) {
                    setCurrentEditedId(null);
                    setFormData(initialAddressFormData);
                    toast.success(data?.payload?.message)
                    dispatch(fetchAllAddresses(user?.id))
                }

            })
        }
        else{
        dispatch(addNewAddress({
            ...formData,
            userId: user?.id,
        })).then((data) => {
            if (data?.payload.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchAllAddresses(user?.id)).then((data) => {
                    if (data?.payload?.success) {
                        setFormData(initialAddressFormData);
                    }
                    else{
                        
                    }
                })
            }
            else{
                toast.error(data?.payload?.message);
            }
        })
    }
    }
    function handleAddressDelete(getCurrentAddress) {
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress?._id })).then((data) => {
            if (data?.payload?.success) {
                toast.success(data?.payload?.message)
                dispatch(fetchAllAddresses(user?.id))
            }
            else {
                toast.error(data?.payload?.message)
            }
        })
    }

    function handleEditAddress(getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?._id)
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            pincode: getCurrentAddress?.pincode,
            phone: getCurrentAddress?.phone,
            notes: getCurrentAddress?.notes,
        })
    }

    function isFormValid() {
        return Object.keys(formData).map(key => formData[key].trim() !== "").every((item) => item);
    }

    return (
        <Card>
            <div className='grid p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                {
                    addressList && addressList.length > 0 ?
                        addressList.map((singleAddressItem, index) => <AddressCard selectedId={selectedId} handleAddressDelete={handleAddressDelete} handleEditAddress={handleEditAddress} addressInfo={singleAddressItem} key={singleAddressItem._id} setCurrentSelectedAddress={setCurrentSelectedAddress} index={index} />) : null
                }
            </div>
            <CardHeader>
                <CardTitle>
                    {
                        currentEditedId !== null ? "Edit Address" : "Add New Address"
                    }
                </CardTitle>
            </CardHeader>
            <CardContent className={"space-y-4"}>
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={
                        currentEditedId !== null ? "Edit" : "Add"
                    }
                    onSubmit={handleManageAddress}
                    isBtnDisabled={!isFormValid()}
                />
            </CardContent>
        </Card>
    )
}

export default Address