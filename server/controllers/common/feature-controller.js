import Feature from "../../models/Feature.js";

export const addFeatureImage = async(req,res)=>{
    try{
        const {image} = req.body;

        const newImage = new Feature({image});

        await newImage.save();

        return res.status(201).json({ success: true, message: "Feature image added successfully",})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while uploading feature image!!!"
        });
    }
}

export const getFeatureImages = async(req,res)=>{
    try{
        
        const images= await Feature.find({})

        return res.status(201).json({ success: true, message: "Feature image fetched successfully", data: images})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching feature image!!!"
        });
    }
}