import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addNewProducts = createAsyncThunk('/products/addNewProducts', 
    async(formData, {rejectWithValue})=>{
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/add`,formData,{
                headers:{
                    'Content-Type': 'application/json',
                }
            })

            return response?.data;
        }
        catch(err){
            const message = err.response.data;
            return rejectWithValue(message);
        }
    }
)

export const fetchAllProducts = createAsyncThunk('/products/fetchAllProducts', 
    async(_, {rejectWithValue})=>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/get`)

            return response?.data;
        }
        catch(err){
            const message = err.response.data || "Something went wrong while fetching products";
            return rejectWithValue(message);
        }
    }
)


export const editProduct = createAsyncThunk('/products/editProduct', 
    async({id, formData}, {rejectWithValue})=>{
        try{
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,
            formData,{
                headers:{
                    'Content-Type': 'application/json',
                }
            });

            return response?.data;
        }
        catch(err){
            const message = err.response.data;
            return rejectWithValue(message);
        }
    }
)

export const deleteProduct = createAsyncThunk('/products/deleteProduct', 
    async(id, {rejectWithValue})=>{
        try{
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`);

            return response?.data;
        }
        catch(err){
            const message = err.response?.data;
            return rejectWithValue(message);
        }
    }
)


const initialState = {
    isLoading : false,
    productList : [],
}

const AdminProductsSlice = createSlice({
    name : "AdminProducts",
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder.addCase(fetchAllProducts.pending, (state)=>{
            state.isLoading = true;
        }).addCase(fetchAllProducts.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.productList = action.payload.data
            console.log(action.payload.message)
        }).addCase(fetchAllProducts.rejected, (state, action)=>{
            state.isLoading = false;
            state.productList = [];
            console.log("Rejected")
            console.log(action.payload.message)
        })
    }
})


export default AdminProductsSlice.reducer;