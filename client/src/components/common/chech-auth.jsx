import React from 'react'
import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CheckAuth = ({children}) => {

    const {isAuthenticated, user} = useSelector((state)=> state.auth) // useSelector((state)=> state.auth);
  
    const location = useLocation();

    if(location.pathname === "/"){
        if(!isAuthenticated){
            return <Navigate to='/auth/login' replace />
        }
        else{
            if(user?.role === 'admin'){
            return <Navigate to='/admin/dashboard' replace />
        }
        else{
            return <Navigate to='/shop/home' replace />
        }
        }
    }

    if(!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))){
        return <Navigate to='/auth/login' replace />
    }

    if(isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))){
        if(user?.role === 'admin'){
            return <Navigate to='/admin/dashboard' replace />
        }
        else{
            return <Navigate to='/shop/home' replace />
        }
    }

    if(isAuthenticated && user?.role !== 'admin' && location.pathname.includes('admin')){
        return <Navigate to='/shop/home' replace />
    }

    if(isAuthenticated && user?.role === 'admin' && location.pathname.includes('shop')){
        return <Navigate to='/admin/dashboard' replace />
    }

    return <>{children}</>

}

export default CheckAuth