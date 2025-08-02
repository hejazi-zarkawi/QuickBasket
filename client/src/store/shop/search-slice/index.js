
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const initialState= {
    isLoading : false,
    searchResults: []
}

export const getSearchResults = createAsyncThunk(
  "/order/getSearchResults",
  async (keyword, {rejectWithValue}) => {
    try{
        const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/search/${keyword}`,
    );

    return response.data;
    }
    catch(err){
        if (err.response) {
                // Server responded with non-2xx status
                return rejectWithValue(err.response.data?.error || err.response.data);
            } else if (err.request) {
                // Request made but no response received
                return rejectWithValue("No response from server");
            } else {
                // Other errors (network issues, etc)
                return rejectWithValue(err.message || "Network error");
            }
    }
  }
);

const searchSlice = createSlice({
    name : 'searchSlice',
    initialState,
    reducers: {
        resetSearch : (state)=>{
            state.searchResults=[]
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(getSearchResults.pending, (state)=>{
            state.isLoading = true;
        }).addCase(getSearchResults.fulfilled, (state,action)=>{
            state.isLoading= true;
            state.searchResults = action.payload.data
        }).addCase(getSearchResults.rejected, (state,action)=>{
            state.isLoading= false;
            state.searchResults = null;
        })
    }
})

export const {resetSearch} = searchSlice.actions;

export default searchSlice.reducer ;