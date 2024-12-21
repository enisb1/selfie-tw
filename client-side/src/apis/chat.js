import axios from 'axios'

export const getChat = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/chat/messages`)
        return response.data
    }catch (error) {
        throw error.response.data
    }
}

export const postMessage = async (message, username) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/chat/postMessage`, {message: message, sender: username})
        return response.data
    }catch (error) {
        throw error.response.data
    }
}