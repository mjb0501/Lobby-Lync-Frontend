import { createContext } from 'react';

interface AuthContextType {
    auth: boolean
    login: () => void
    logout: () => void
}

const authContextInitial: AuthContextType = {
    auth: false,
    login: () => {},
    logout: () => {}
}

export const AuthContext = createContext<AuthContextType>(authContextInitial);

export default AuthContext;