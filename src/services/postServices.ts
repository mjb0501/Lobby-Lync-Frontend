import axios from 'axios';

export const getPosts = async (params: { gameName?: string | null, page?: number, limit?: number } = {}) => {
    try {
        console.log("Get posts ran")
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
    } catch (error: unknown) {
        console.error('Error creating post: ', error);
        throw error;
    }
};

export const acceptPost = async (acceptData: {postId: number, description: string, platform: string, platformUsername: string, creatorId: number }) => {
    try {
        const response = await axios.post(`/posts/acceptPost`, acceptData);
        return response.data.response.id as number;
    } catch (error) {
        console.error('Error accepting post:', error);
        throw error;
    }
}

export const fetchUserPost = async () => {
    try {
        const response = await axios.get(`/posts/getPostById`);
        return response.data
    } catch (error) {
        console.error('Error fetching post by id:', error);
        throw error;
    }
}

export const deletePost = async () => {
    try {
        await axios.delete('/posts/deletePost');
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

export const getAcceptedPosts = async () => {
    try {
        const response = await axios.get(`/posts/getAcceptedPosts`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const deletePostAcceptance = async (postId: number) => {
    try {
        await axios.delete(`/posts/deletePostAcceptance`, {params: { postId }});
    } catch (error) {
        console.log(error)
    }
}

export const rejectPostAcceptance = async (acceptData: { username: string, postId: number }) => {
    try {
        const { username, postId } = acceptData;
        await axios.delete(`/posts/rejectPostAcceptance`, {data: {username, postId}});
    } catch (error) {
        console.log(error);
    }
}

export const editPost = async (postData: {postId: number, platformIds: string[], gameId: number, description: string}) => {
    try {
        await axios.put(`/posts/updatePost`, postData)
    } catch (error) {
        console.log(error);
    }
}