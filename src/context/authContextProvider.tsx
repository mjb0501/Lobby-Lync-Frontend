import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser, logoutUser } from "../services/authServices";
import { ContextType, UserType } from "../types";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const INITIAL_USER = {
    id: '',
    username: '',
    email: '',
    platforms: {}
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    setUser: () => {},
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    logout: () => {},
    checkAuthUser: async () => false as boolean,
}

const AuthContext = createContext<ContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();
            
            if(currentAccount[0]) {
                setUser({
                    id: currentAccount[0].id,
                    username: currentAccount[0].username,
                    email: currentAccount[0].email,
                    platforms: currentAccount[0].platforms || {},
                })

                await queryClient.invalidateQueries();
                await queryClient.refetchQueries();

                setIsAuthenticated(true);

                return true;
            }

            return false;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        queryClient.clear();
        setUser(INITIAL_USER);
        setIsAuthenticated(false);
        localStorage.clear();
        document.cookie = 'accessToken=; Max-Age=-1; path=/';
        await logoutUser();
        navigate('/login');
    }

    useEffect(() => {
        checkAuthUser();
    }, []);

    const value: ContextType = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        checkAuthUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);