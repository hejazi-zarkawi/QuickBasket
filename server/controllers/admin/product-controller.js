import {imageUploadUtil} from '../../helpers/cloudinary.js'
import Product from '../../models/Product.js'
export const handleImageUpload= async(req,res)=>{
    try{
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:"+ req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url)

        res.status(200).json({
            success: true,
            result,
        })
    }
    catch(error){
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Error occured"
        })
    }
}

export const addProduct = async(req,res)=>{

    const {image, title,description, category, brand, price, salePrice, totalStock} = req.body;
    try{
        if(!image || !title || !description || !category || !brand || !price || !totalStock){
            return res.status(400).json({success: false, message: "Please fill all the fields!"})
        }

        const newProduct = new Product({
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock
        })

        await newProduct.save();

        return res.status(201).json({ success: true, message: "Product added successfully", data: newProduct})

    }
    catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Error while adding Product"})
    }
}

export const fetchAllProduct = async(req,res)=>{
    try{
        const listOfProducts = await Product.find({})
        if(listOfProducts.length === 0){
            return res.status(200).json({
                success: true,
                data: [],
                message: "No products found!"
            })
        }

        return res.status(200).json({
            success: true,
            data: listOfProducts
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Error while fetching Product"})
    }
}


export const editProduct = async(req,res)=>{
    const {id} = req.params
    const {image,title,description, category, brand, price, salePrice, totalStock} = req.body;
    if(!id){
        return res.status(400).json({success: false, message: "Product ID is required!"})
    }
    try{
        if(!image || !title || !description || !category || !brand || !price || !totalStock){
            return res.status(400).json({success: false, message: "Please fill all the fields!"})
        }

        const updatedProduct = await Product.findById(id);

        if(!updatedProduct){
            return res.status(404).json({success: false, message: "Product not found!"})
        }

        updatedProduct.image = image== ""? updatedProduct.image : image || updatedProduct.image;
        updatedProduct.title = title || updatedProduct.title;   
        updatedProduct.description = description || updatedProduct.description;
        updatedProduct.category = category || updatedProduct.category;
        updatedProduct.brand = brand || updatedProduct.brand;
        updatedProduct.price = price =="" ? 0 : price || updatedProduct.price;
        updatedProduct.salePrice = salePrice =="" ? 0 : salePrice || updatedProduct.salePrice;
        updatedProduct.totalStock = totalStock || updatedProduct.totalStock;
        await updatedProduct.save();

        return res.status(200).json({ success: true, message: "Product edited successfully", data: updatedProduct})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Error while editing Product"})
    }
}

export const deleteProduct = async(req,res)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({success: false, message: "Product ID is required!"})
    }
    try{
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct){
            return res.status(404).json({success: false, message: "Product not found!"})
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Error while deleting Product"})
    }
}