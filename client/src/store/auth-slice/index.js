import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated : false,
    isLoading : true,
    user : null,
    token: null,
}

export const registerUser = createAsyncThunk('/auth/register',
    async(formData,{rejectWithValue}) =>{
        try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,
            formData,{
                withCredentials: true,
            }
        );

        return response?.data;
    }
    catch(err){
        const message = err.response.data;
        return rejectWithValue(message);
    }
    }
)

export const loginUser = createAsyncThunk('/auth/login',
    async(formData,{rejectWithValue}) =>{
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,formData,{
                withCredentials: true,
            })

            return response.data;
        }
        catch(err){
            const data = err.response.data;
            return rejectWithValue(data);
        }
    }
)

export const logoutUser = createAsyncThunk('/auth/logout',
    async(_,{rejectWithValue})=>{
        try{
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`,{},{
                withCredentials: true,
            });
            return response.data;
        }
        catch(err){
            const message = err.response.data;
            return rejectWithValue(message);
        }
    }
)

export const checkAuth = createAsyncThunk('/auth/checkAuth',
    async(token,{rejectWithValue}) =>{
        try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
            {
                headers: {
                    Authorization : `Bearer ${token}`,
                    'Cache-Control': "no-store, no-cache, must-revalidate, proxy-revalidate",
                }
            }
        );
        
        return response.data;
    }
    catch(err){
        const message = err.response.data;
        return rejectWithValue(message);
    }
    }
)

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
        setUser : (state, action) =>{},
        resetTokenAndCredentials : (state)=>{
            state.isAuthenticated= false;
            state.user = null;
            state.token= null;
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(registerUser.pending, (state) =>{
            state.isLoading = true;
        })
        .addCase(registerUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(registerUser.rejected, (state) =>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(loginUser.pending, (state)=>{
            state.isLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.user = action.payload.user ;
            state.isAuthenticated = true ;
            state.token = action.payload.token;
            sessionStorage.setItem('token', JSON.stringify(action.payload.token));
        
        }).addCase(loginUser.rejected, (state) =>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
        }).addCase(checkAuth.pending, (state)=>{
            state.isLoading = true;
        }).addCase(checkAuth.fulfilled, (state, action) =>{
            state.isLoading = false;
            state.user = action.payload.user ;
            state.isAuthenticated = true ;
            
        }).addCase(checkAuth.rejected, (state,action) =>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        }).addCase(logoutUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
    }
    
})

export const {setUser, resetTokenAndCredentials} = authSlice.actions;
export default authSlice.reducer;