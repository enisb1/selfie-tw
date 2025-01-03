import axios from 'axios'

// get all notifications
export async function getNotifications(username) {
    try {
        const response = await axios.post(`http://localhost:8000/api/notifications/getNotifications`,
            {
                receiver: username,
            });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// get new notifications
export async function getNewNotifications(username) {
    try {
        const response = await axios.post(`http://localhost:8000/api/notifications/getNewNotifications`,
            {
                receiver: username,
            });
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
            title: "Messaggio da "+sender,
            text: text,
            type: "message"
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// mark notification as read
export async function readNotification(id) {
    try {
        const response = await axios.post(`http://localhost:8000/api/notifications/readNotification`, {
            _id: id
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// accept activity invite
export async function acceptInvite(id,userId,notificationId,type) {
    try {
        const response = await axios.post(`http://localhost:8000/api/notifications/acceptInvite`, {
            id: id,
            userId: userId,
            notificationId: notificationId,
            type: type
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// decline activity invite
export async function declineInvite(id) {
    try {
        const response = await axios.post(`http://localhost:8000/api/notifications/declineInvite`, {
            id: id,
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}