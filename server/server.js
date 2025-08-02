import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";   
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from "./routes/auth/auth-route.js"
import adminProductsRouter from "./routes/admin/products-routes.js"
import adminOrdersRouter from "./routes/admin/order-routes.js"

import shopProductsRouter from "./routes/shop/products-routes.js"
import shopCartRouter from "./routes/shop/cart-routes.js"
import shopAddressRouter from "./routes/shop/address-routes.js"
import shopOrderRouter from "./routes/shop/order-routes.js"
import shopSearchRouter from "./routes/shop/search-routes.js"
import shopReviewRouter from "./routes/shop/review-routes.js"

import CommonFeatureRouter from "./routes/common/feature-routes.js"

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() =>{console.log("MongoDB connected")}).catch((err)=>{console.log("Got error while connecting to MongoDB")});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_BASE_URL,
    methods : ["GET", "POST", "PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization","Pragma","Cache-Control","Expires"],
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use('/api/auth',authRoute);
app.use('/api/admin/products', adminProductsRouter)
app.use('/api/admin/orders', adminOrdersRouter)

app.use('/api/shop/products', shopProductsRouter)
app.use('/api/shop/cart', shopCartRouter)
app.use('/api/shop/address', shopAddressRouter)
app.use('/api/shop/order', shopOrderRouter)
app.use('/api/shop/search', shopSearchRouter)
app.use('/api/shop/review', shopReviewRouter)

app.use('/api/common/feature', CommonFeatureRouter)

app.listen(PORT, ()=>{console.log(`Server is running on port ${PORT}`)});