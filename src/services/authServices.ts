import axios from 'axios';

export const loginUser = async (email: string, password: string): Promise<{ token: string }> => {
    try {
        const response = await axios.post(`/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error('Error logging in user: ', error);
        throw error;
    }
    
};

export const registerUser = async (username: string, email: string, password: string): Promise<void> => {
    try {
        await axios.post(`/auth/register`, { username, email, password });
    } catch (error) {
        console.error('Error registering user: ', error);
        throw error;
    }
    
  };

export const getCurrentUser = async () => {
    try {
        const response = await axios.get(`/auth/check`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const logoutUser = async () => {
    try {
        await axios.post(`/auth/logout`);
    } catch (error) {
        console.error('Error logging out user: ', error);
    }
    
}

export const editPlatforms = async (platformData: {Xbox: string, Playstation: string, Steam: string, Switch: string}) => {
    try {
        await axios.put(`/auth/editPlatforms`, platformData)
    } catch (error) {
        console.log(error);
    }
}