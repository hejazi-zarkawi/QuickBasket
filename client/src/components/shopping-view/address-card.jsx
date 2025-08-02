import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'

const AddressCard = ({ addressInfo, index, handleAddressDelete, handleEditAddress, setCurrentSelectedAddress, selectedId }) => {

  const {user} = useSelector((state)=> state.auth)
  return (
    <Card onClick={()=> setCurrentSelectedAddress ? setCurrentSelectedAddress(addressInfo) : null} className={`cursor-pointer  ${selectedId?._id === addressInfo._id? 'border-blue-900 border-[4px]' : 'border-black'} `}>
      <CardHeader>
        <CardTitle>
          Address {index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className='grid p-4 pl-6 gap-4'>
        <Label><span className='text-md font-semibold'>Address</span> : {addressInfo?.address}</Label>
        <Label><span className='text-md font-semibold'>City:</span> {addressInfo?.city}</Label>
        <Label><span className='text-md font-semibold'>Pincode: </span> {addressInfo?.pincode}</Label>
        <Label><span className='text-md font-semibold'>Phone:</span> {addressInfo?.phone}</Label>
        <Label><span className='text-md font-semibold'>Notes:</span> {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className={"flex gap-4"}>
        <Button onClick={()=>{handleEditAddress(addressInfo)}} className={"cursor-pointer"}>Edit</Button>
        <Button className={"cursor-pointer"} onClick={()=>{handleAddressDelete(addressInfo)}}>Delete</Button>
      </CardFooter>
    </Card>
  )
}

export default AddressCard