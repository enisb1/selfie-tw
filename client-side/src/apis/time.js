import axios from 'axios'

export const getServerTime = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/time/serverTime`)
        return response.data.data
    }catch (error) {
        throw error.response.data
    }
}

export const setNewGlobalTime = async (date) => {
    try {
        const response = await axios.post(`http://localhost:8000/api/time/setNewGlobalTime`, {date: date})
        return response.data
    }catch (error) {
        throw error.response.data
    }
}

export const rollBackTime = async () => {
    try {
        const response = await axios.post(`http://localhost:8000/api/time/rollBackTime`)
        return response.data
    }catch (error) {
        throw error.response.data
    }
}