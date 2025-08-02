import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true, 
    },
    description:{
        type:String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    brand:{
        type: String,
        required: true, 
    },
    price:{
        type: Number,
        required: true,
    },
    salePrice:{
        type: Number,
        required: false,    
    },
    totalStock:{
        type: Number,
        required: true,
    }
},{
    timestamps: true,
});

const Product = mongoose.model('Product',ProductSchema);
export default Product;