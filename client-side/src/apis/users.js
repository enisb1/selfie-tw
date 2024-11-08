import axios from 'axios'

// register new user
export async function newUser(username,password,email,firstName,lastName,telegram){
    try {
        const response = await axios.post(`http://localhost:8000/api/login/addUser`, {
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName,
            telegram: telegram
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching events: ", error);
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
        console.error("Error fetching events: ", error);
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
        console.error("Error fetching events: ", error);
    }
}