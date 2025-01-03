import axios from 'axios';

export const getPosts = async (params: { gameName?: string } = {}) => {
    try {
        const response = await axios.get(`/posts/getPosts`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const createPost = async (postData: { platformIds: string[], gameId: number, description: string}) => {
    try {
        const response = await axios.post(`/posts/createPost`, postData);
        return response.data
    } catch (error) {
        console.error('Error creating post: ', error);
        throw error;
    }
};