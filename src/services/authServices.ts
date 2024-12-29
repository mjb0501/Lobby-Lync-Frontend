import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const loginUser = async (email: string, password: string): Promise<{ token: string }> => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
};

export const registerUser = async (username: string, email: string, password: string): Promise<void> => {
    await axios.post(`${API_URL}/auth/register`, { username, email, password });
  };