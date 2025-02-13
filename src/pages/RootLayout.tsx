import BottomNavBar from '../components/bottomNavBar';
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

        <BottomNavBar />
    </div>
  )
}

export default RootLayout