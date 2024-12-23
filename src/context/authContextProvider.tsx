import { useState, ReactNode, useEffect } from 'react';
import { AuthContext } from './authContext';

export const AuthProvider = ({
    children
}: {children: ReactNode}) => {
    const [auth, setAuth] = useState<boolean>(false);

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
    }, [])

    return (
        <AuthContext.Provider value={{ auth, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}