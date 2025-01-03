import { useState, ReactNode, useEffect } from 'react';
import { AuthContext } from './authContext';
import { checkAuth, logoutUser } from '../services/authServices';

//Context provider for the entire website that propagates whether a user is logged in or not
export const AuthProvider = ({
    children
}: {children: ReactNode}) => {
    const [auth, setAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const login = () => setAuth(true);
    
    const logout = () => {
        try {
            logoutUser();
            setAuth(false);
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await checkAuth();
                setAuth(response.loggedIn);
            } catch {
                setAuth(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuthorization();
    }, [])

    return (
        <AuthContext.Provider value={{ auth, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}