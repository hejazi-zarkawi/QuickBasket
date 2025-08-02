import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchAllFilteredProducts', 
    async({filterParams, sortParams}, {rejectWithValue})=>{
        try{

            const query = new URLSearchParams({
                ...filterParams,
                sortBy : sortParams,
            }) 

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`)

            return response?.data;
        }
        catch(err){
            const message = err.response.data || "Something went wrong while fetching products";
            return rejectWithValue(message);
        }
    }
)

export const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails', 
    async(id, {rejectWithValue})=>{
        try{

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`)

            return response?.data;
        }
        catch(err){
            const message = err.response.data || "Something went wrong while fetching product details";
            return rejectWithValue(message);
        }
    }
)


const initialState = {
    isLoading : false,
    productsList : [],
    productDetails : null
}

const ShoppingProductsSlice = createSlice({
    name : "shoppingProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder.addCase(fetchAllFilteredProducts.pending, (state) =>{
            state.isLoading = true;
        })
        .addCase(fetchAllFilteredProducts.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.productsList = action.payload.data;
        })
        .addCase(fetchAllFilteredProducts.rejected, (state, action) =>{
            state.isLoading = false;
            
        }).addCase(fetchProductDetails.pending, (state) =>{
            state.isLoading = true;
        })
        .addCase(fetchProductDetails.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.productDetails = action.payload.data;
        })
        .addCase(fetchProductDetails.rejected, (state, action) =>{
            state.isLoading = false;
            state.productDetails = null;
        })
    }
})

export default ShoppingProductsSlice.reducer;