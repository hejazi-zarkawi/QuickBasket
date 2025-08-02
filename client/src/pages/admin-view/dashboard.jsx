import ProductImageUpload from '@/components/admin-view/productImageUpload';
import { Button } from '@/components/ui/button';
import { addFeatureImage, getFeatureImages } from '@/store/common-slice';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const AdminDashBoard = () => {
  const [image, setImage] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageAlreadyUploaded, setimageAlreadyUploaded] = useState(false)
  const {featureImageList} = useSelector((state)=> state.commonFeature)
  const dispatch = useDispatch()


  useEffect(()=>{
    dispatch(getFeatureImages())
  },[dispatch])
  

  function handleUploadFeatureImage(){
    dispatch(addFeatureImage({image: uploadedImageUrl})).then((data)=>{
      if(data?.payload?.success){
        dispatch(getFeatureImages())
        toast.success(data?.payload?.message)
      setImage(null)
      setUploadedImageUrl("")
      }
      
    })
  }

  return (
    <div className='w-full'>

      {imageUploadLoading ? (
                <div className='flex items-center justify-center h-32'>
                  <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
                </div>):
      <ProductImageUpload
                image={image}
                setImage={setImage}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageUploadLoading={setImageUploadLoading}
                imageAlreadyUploaded={imageAlreadyUploaded}
                setimageAlreadyUploaded={setimageAlreadyUploaded}
                // isEditMode = {currentEditedId !== null}
        /> }
              <Button disabled={!uploadedImageUrl} onClick={handleUploadFeatureImage} className={" disabled:cursor-not-allowed cursor-pointer mt-6 w-full"}>Upload</Button>

            {
              featureImageList && featureImageList?.length > 0 ?
              featureImageList.map((featureImgItem)=> <div className='flex flex-col gap-5 mt-10'> <div className='relative'>
                <img src={featureImgItem.image} className='w-full h-[300px] object-cover rounded-t-lg' />
            </div></div>) : null
            }

              </div>
  )
}

export default AdminDashBoard