import axios from 'axios'

// register new user
export async function newUser(username,password,email,firstName,lastName,
    unavailableStart, unavailableEnd, unavailableFrequency, unavailableRepNumber, unavailableRepDate){
    try {
        const response = await axios.post(`https://site232418.tw.cs.unibo.it/api/login/addUser`, {
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            unavailableStart: unavailableStart,
            unavailableEnd: unavailableEnd,
            unavailableFrequency, unavailableFrequency,
            unavailableRepNumber: unavailableRepNumber,
            unavailableRepDate: unavailableRepDate
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// check user password
export async function checkUserPassword(username,password) {
    try {
        const response = await axios.post(`https://site232418.tw.cs.unibo.it/api/login/passwordCheck`, {
            username: username,
            password: password
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// check if username is available
export async function checkUsername(username) {
    try {
        const response = await axios.post(`https://site232418.tw.cs.unibo.it/api/login/checkUsername`, {
            username: username
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// get all users
export async function getAllUsers() {
    try {
        const response = await axios.get(`https://site232418.tw.cs.unibo.it/api/login/allUsers`);
        return response.data.users;
    } catch (error) {
        throw error.response.data;
    }
}

export async function updateUnavailability(userId, updatedData) {
    try {
        const response = await axios.put(`https://site232418.tw.cs.unibo.it/api/login/updateUnavailability/${userId}`, updatedData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function getUser(userId) {
    try {
        const response = await axios.get(`https://site232418.tw.cs.unibo.it/api/login/getUser/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function getUsers(userIds) {
    try {
        const response = await axios.post(`https://site232418.tw.cs.unibo.it/api/login/getUsers`, { userIds });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function getUserIdsByEmails(emails) {
    try {
        const response = await axios.post('https://site232418.tw.cs.unibo.it/api/login/getUserIdsByEmails', { emails });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function checkUsernameResourcesUsers(username) {
    try {
        const response = await axios.get(`https://site232418.tw.cs.unibo.it/api/login/checkUsernameResourcesUsers/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error checking username:', error);
        throw error;
    }
}