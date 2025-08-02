import axios from "axios"

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    isLoading : false,
    addressList : [],
}

export const addNewAddress = createAsyncThunk("/addresses/addNewAddress", 
    async(formData, rejectWithValue)=>{
        try{

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/address/add`, formData);

            return response?.data;
        }
        catch(error){
            const message = error?.response?.data || "Error while adding address";
            return rejectWithValue(message);
        }
})


export const fetchAllAddresses = createAsyncThunk("/addresses/fetchAllAddresses", 
    async(userId, rejectWithValue)=>{
        try{

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/address/get/${userId}`,);

            return response?.data;
        }
        catch(error){
            const message = error?.response?.data || "Error while fetching address";
            return rejectWithValue(message);
        }
})

export const editAddress = createAsyncThunk("/addresses/editAddress", 
    async({userId, addressId, formData}, rejectWithValue)=>{
        try{

            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/shop/address/update/${userId}/${addressId}`, formData);

            return response?.data;
        }
        catch(error){
            const message = error?.response?.data || "Error while updating the address";
            return rejectWithValue(message);
        }
})


export const deleteAddress = createAsyncThunk("/addresses/deleteAddress", 
    async({userId, addressId}, rejectWithValue)=>{
        try{

            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId}/${addressId}`,);

            return response?.data;
        }
        catch(error){
            const message = error?.response?.data || "Error while deleting the address";
            return rejectWithValue(message);
        }
})

const addressSlice = createSlice({
    name : 'address',
    initialState,
    reducers: {},
    extraReducers: (builder) =>{
        builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
    }
})

export default addressSlice.reducer;