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
    }
    
  };

export const checkAuth = async (): Promise<{ loggedIn: boolean; message: string}> => {
    try {
        const response = await axios.get(`/auth/check`);
        return response.data;
    } catch {
        console.log('User is not logged in.')
        return { loggedIn: false, message: 'Error occurred while checking authentication status' };
    }
    
  }

export const logoutUser = async () => {
    try {
        await axios.post(`/auth/logout`);
    } catch (error) {
        console.error('Error logging out user: ', error);
    }
    
}