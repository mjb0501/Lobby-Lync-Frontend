import axios from 'axios';

export const getMessages = async (conversationId: number) => {
    try {
        const response = await axios.get(`/messages/getMessages`, {params: { conversationId }});
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

export const sendMessage = async (conversationId: number, content: string) => {
    try {
        await axios.post(`/messages/sendMessage`, { conversationId, content });
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

export const deleteConversation = async (conversationId: number) => {
    try {
        console.log(conversationId);
        await axios.delete('/messages/deleteConversation', {params: {conversationId}});
    } catch (error) {
        console.error('Error deleting conversation:', error);
        throw error;
    }
}