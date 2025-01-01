import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Replace with your backend URL

export const getPosts = async (params: { gameName?: string } = {}) => {
    try {
        const response = await axios.get(`${API_URL}/posts/getPosts`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};