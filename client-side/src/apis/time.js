import axios from 'axios'

export const getServerTime = async () => {
    try {
        const response = await axios.get(`https://site232418.tw.cs.unibo.it/api/time/serverTime`)
        return response.data.data
    }catch (error) {
        throw error.response.data
    }
}

export const setNewGlobalTime = async (date) => {
    try {
        const response = await axios.post(`https://site232418.tw.cs.unibo.it/api/time/setNewGlobalTime`, {date: date})
        return response.data
    }catch (error) {
        throw error.response.data
    }
}

export const rollBackTime = async () => {
    try {
        const response = await axios.post(`https://site232418.tw.cs.unibo.it/api/time/rollBackTime`)
        return response.data
    }catch (error) {
        throw error.response.data
    }
}