import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import CommonForm from '@/components/common/form'
import { useState } from 'react'
import { addProductFormElements } from '@/config'
import ProductImageUpload from '@/components/admin-view/productImageUpload'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addNewProducts, fetchAllProducts, editProduct, deleteProduct } from '@/store/admin/products-slice'
import toast from 'react-hot-toast'
import AdminProductTile from '@/components/admin-view/product-tile'

const AdminProducts = () => {
  const initialState = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
  }
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialState)
  const [image, setImage] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [imageAlreadyUploaded, setimageAlreadyUploaded] = useState(false)
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { productList, isLoading } = useSelector((state) => state.adminProducts)

  useEffect(() => {
    dispatch(fetchAllProducts())
    console.log("Product", productList)
  }, [dispatch])


  function onSubmit(event) {
    event.preventDefault();
    console.log("Form Data:", formData);
    if(currentEditedId !== null){
      try {
        dispatch(editProduct({id : currentEditedId, formData})
        ).then((data) => {
          console.log(data)
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenAddProductDialog(false);
            setFormData(initialState);
            setCurrentEditedId(null)
            toast.success(data.payload?.message)// Refresh the product list after adding a new product
          }
          else {
            toast.error(data?.payload?.message);
          }
        })
      }
      catch (error) {
        toast.error("Failed to edit product. Please try again.");
        return;
      }
    }
    else{
      try {
      const finalFormData = { ...formData, image: uploadedImageUrl };
      console.log("Form Data:", finalFormData);
      dispatch(addNewProducts(finalFormData)
      ).then((data) => {
        console.log(data)
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenAddProductDialog(false);
          setFormData(initialState);
          setImage(null);
          setUploadedImageUrl("");
          setimageAlreadyUploaded(false);
          toast.success(data.payload?.message)// Refresh the product list after adding a new product
        }
        else {
          toast.error(data?.payload?.message);
        }
      })
    }
    catch (error) {
      toast.error("Failed to add product. Please try again.");
      return;
    }
  }
    
  }

  function isFormValid(){
    return formData.title && formData.description && formData.category && formData.brand && formData.price && formData.totalStock && (formData.image || imageAlreadyUploaded || uploadedImageUrl);
  }

  function handleDelete(getProductId){
    const confirm = window.confirm("Are you sure you want to delete this product?");
    if(!confirm) return;
    dispatch(deleteProduct(getProductId)).then((data) =>{
      if(data?.payload?.success){
        dispatch(fetchAllProducts());
        toast.success(data?.payload?.message);
      }
    })
  }

  return (
    <>
      <div className='flex flex-col mb-4 gap-8 p-4 w-full'>
        <div className='flex justify-end items-center  w-full'>
          <Button className="cursor-pointer " onClick={() => setOpenAddProductDialog(true)}><div>Add Product</div></Button></div>

        <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {
             isLoading ? (<div className=' flex items-center justify-center h-screen'>
              <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
            </div>): (

              productList && productList.length > 0 ? (
                productList.map((productItem) => (
                <AdminProductTile
                   key={productItem._id} 
                   product={productItem}
                   setOpenAddProductDialog = {setOpenAddProductDialog}
                   setFormData = {setFormData}
                   setCurrentEditedId = {setCurrentEditedId}
                   handleDelete = {handleDelete}
                    />))
              ) : "No products found!")
          }

        </div>
        <Sheet open={openAddProductDialog} onOpenChange={()=>{
          setOpenAddProductDialog(false);
          setFormData(initialState);
          setCurrentEditedId(null);
          }}>
          <SheetContent side="right" className={"overflow-auto"} >
            <SheetHeader >
              <SheetTitle className="flex justify-center border-b-2 w-64 m-auto p-4 pt-4 mb-2">
                <div className='text-xl font-semibold'>{
                  currentEditedId !==null ? "Edit Product" : "Add New Product"
                  }</div>
              </SheetTitle>
            </SheetHeader>
            <div className='p-4 mb-4'>
              {imageUploadLoading ? (
                <div className='flex items-center justify-center h-32'>
                  <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
                </div>
              ) : <ProductImageUpload
                image={image}
                setImage={setImage}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageUploadLoading={setImageUploadLoading}
                imageAlreadyUploaded={imageAlreadyUploaded}
                setimageAlreadyUploaded={setimageAlreadyUploaded}
                isEditMode = {currentEditedId !== null}
              />}
              <CommonForm

                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                buttonText={
                  currentEditedId !==null ? "Edit" : "Add"
                  }
                  isBtnDisabled = {!isFormValid()}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default AdminProducts