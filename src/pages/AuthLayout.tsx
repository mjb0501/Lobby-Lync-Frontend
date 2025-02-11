import { useUserContext } from '../context/authContextProvider'
import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout = () => {
    const { isLoading, isAuthenticated } = useUserContext();

    if(isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    if(isAuthenticated) {
        return <Navigate to="/posts" replace />
    }

  return (
    <div>
        <Outlet />
    </div>
  )
}

export default AuthLayout