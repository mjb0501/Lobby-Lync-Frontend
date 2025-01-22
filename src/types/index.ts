export type ContextType = {
    user: UserType;
    setUser: React.Dispatch<React.SetStateAction<UserType>>;
    isLoading: boolean;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
    checkAuthUser: () => Promise<boolean>;
}

export type UserType = {
    id: string;
    username: string;
    email: string;
}