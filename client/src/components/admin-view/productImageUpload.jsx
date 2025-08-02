import { Label } from '../ui/label'
import { Input } from '../ui/input';
import React, { useRef ,useEffect, useState} from 'react'
import { LuCloudUpload } from "react-icons/lu";
import { CiFileOn } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';


const ProductImageUpload = ({ image, setImage, uploadedImageUrl, setUploadedImageUrl,setImageUploadLoading, imageAlreadyUploaded,setimageAlreadyUploaded, isEditMode }) => {

    const inputRef = useRef(null);
    
    function handleImageFileChange(event) {
        const selectedFile = event.target.files?.[0];
        setImage(selectedFile)
    }

    function handleDragOver(event) {
        event.preventDefault(); 
    }

    function handleDrop(event){
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
            setImage(droppedFile)
        }
    }

    function handleRemoveImage(event){
        setImage(null);
        setimageAlreadyUploaded(false);
        setUploadedImageUrl("");
        if(inputRef.current){
            inputRef.current.value = "";
        }
    }

    async function uploadImageToCloudinary(){
        setImageUploadLoading(true);
        const data = new FormData();
        data.append("my-file", image);
        try{
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,data)
          
          if(response?.data?.success) {
            console.log("Image uploaded successfully:", response.data.result.url);
            setimageAlreadyUploaded(true)
            setUploadedImageUrl(response.data.result.url)
            setImageUploadLoading(false);
          }
        }
       catch (err) {
        console.error("Upload failed:", err.response?.data || err.message);
      }
        
      }
    
      useEffect(()=>{
        if(image !== null && !imageAlreadyUploaded) uploadImageToCloudinary()
      }, [image, imageAlreadyUploaded])

    return (
        <div className=' h-32 mb-3 w-full'>
            <div className='flex flex-col gap-2'>
                <Label className='text-md font-semibold mb-2'>Upload Image</Label>
                <div onDragOver={handleDragOver} onDrop={handleDrop} className={`${isEditMode ? "opacity-50": " "}border-2 border-dashed rounded-lg p-4 flex items-center justify-center`}>
                <Input className="file:font-bold cursor-pointer hidden" id="image-upload" type="file" accept="image/*" ref={inputRef} disabled = {isEditMode} onChange={handleImageFileChange} />
                {
                    !image ? (
                        
                            <Label htmlFor="image-upload" className={` ${isEditMode ? "opacity-50 " : "cursor-pointer"} flex flex-col gap-2 items-center justify-center `} >
                                <LuCloudUpload size={26} />
                                <span className='text-center'>Drag & drop or click to upload image</span>
                            </Label> ) : 
                            (<div className='w-full flex items-center justify-between'>
                                <CiFileOn size={26} />
                                <p className='text-sm font-medium ml-4'>{image.name}</p>
                                <RxCross2 size={20} className='cursor-pointer' onClick={handleRemoveImage} />
                            </div>)
                }
                </div>
            </div>
        </div>
    )
}

export default ProductImageUpload