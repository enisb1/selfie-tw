import axios from 'axios'

// get all notifications
export async function getNotifications() {
    try {
        const response = await axios.get(`http://localhost:8000/api/notifications/getNotifications`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// send new message
export async function sendNotification(sender,receiver,text) {
    try {
        const response = await axios.post(`http://localhost:8000/api/notifications/addNotification`, {
            sender: sender,
            receiver: receiver,
            time: new Date(),
            read: false,
            text: text
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}