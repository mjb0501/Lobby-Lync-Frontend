import React from 'react'
import { useUserContext } from '../context/authContextProvider'
import { Navigate, Outlet } from 'react-router-dom';

const RootLayout = () => {
    const { isLoading, isAuthenticated } = useUserContext();

    if(isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    if(!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

  return (
    <div>
        <Outlet />
    </div>
  )
}

export default RootLayout