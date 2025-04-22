import axios from 'axios'

export const getChat = async () => {
    try {
        const response = await axios.get(`https://site232418.tw.cs.unibo.it/api/chat/messages`)
        return response.data
    }catch (error) {
        throw error.response.data
    }
}

export const postMessage = async (message, username) => {
    try {
        const response = await axios.post(`https://site232418.tw.cs.unibo.it/api/chat/postMessage`, {message: message, sender: username})
        return response.data
    }catch (error) {
        throw error.response.data
    }
}