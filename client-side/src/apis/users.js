import axios from 'axios'

// register new user
export async function newUser(username,password,email,firstName,lastName,telegram,
    unavailableStart, unavailableEnd, unavailableFrequency, unavailableRepNumber, unavailableRepDate){
    try {
        const response = await axios.post(`http://localhost:8000/api/login/addUser`, {
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            telegram: telegram,
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
        const response = await axios.post(`http://localhost:8000/api/login/passwordCheck`, {
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
        const response = await axios.post(`http://localhost:8000/api/login/checkUsername`, {
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
        const response = await axios.get(`http://localhost:8000/api/login/allUsers`);
        return response.data.users;
    } catch (error) {
        throw error.response.data;
    }
}

export async function updateUnavailability(userId, updatedData) {
    try {
        const response = await axios.put(`http://localhost:8000/api/login/updateUnavailability/${userId}`, updatedData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}