import { useState, ReactNode, useEffect } from 'react';
import { AuthContext } from './authContext';

//Context provider for the entire website that propagates whether a user is logged in or not
export const AuthProvider = ({
    children
}: {children: ReactNode}) => {
    const [auth, setAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const login = () => setAuth(true);
    
    const logout = () => {
        localStorage.removeItem('token');
        setAuth(false);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuth(true);
        }
        setLoading(false);
    }, [])

    return (
        <AuthContext.Provider value={{ auth, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}