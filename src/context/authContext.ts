import { createContext } from 'react';

interface AuthContextType {
    auth: boolean
    loading: boolean
    login: () => void
    logout: () => void
}

const authContextInitial: AuthContextType = {
    auth: false,
    loading: true,
    login: () => {},
    logout: () => {}
}

export const AuthContext = createContext<AuthContextType>(authContextInitial);

export default AuthContext;