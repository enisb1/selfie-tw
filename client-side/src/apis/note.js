import axios from "axios";

export async function postNote(title, bodyNote, bodyTask, category, format, access, type, user, userListAccess) {
    await axios.post('http://localhost:8000/api/note/addNote', {"title": title, "bodyNote": bodyNote, "bodyTask": bodyTask, 
                                                                "category": category, "format": format, "access": access,
                                                                "type": type, "user": user, "userListAccess": userListAccess
    })
    .then(({data}) => {
        console.log(data);
    })
}

// Get tasks with expiration in a certain range and filter by username
export async function getExpiringTasksInRange(startDate, endDate, username) {
    const startStringUTC = new Date(startDate).toISOString();
    const endStringUTC = new Date(endDate).toISOString();
    try {
        const response = await axios.get(`http://localhost:8000/api/note/tasks`, {
            params: {
                start: startStringUTC,
                end: endStringUTC,
                username: username
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks: ", error);
        throw error;
    }
}

export async function deleteNote(noteId) {
    
    await axios.delete(`http://localhost:8000/api/note/deleteNote/${noteId}`)
    .then(({data}) => {
        console.log(data);
    })
}

export async function getNoteById(id) {
    try {
        const response = await axios.get(`http://localhost:8000/api/note/getNoteId/${id}`)
        return response.data       
    } catch (error) {
        console.error("Error retrieving note: ", error)
        throw error
    }
}

export async function editNote(noteId, updatedData) {

    await axios.put(`http://localhost:8000/api/note/editNote/${noteId}`, updatedData)
    .then(({data}) => {
        console.log(data);
    })
}

export async function getNoteUser(username, access){
    console.log(username)
    try {
        const response = await axios.get(`http://localhost:8000/api/note/getUserNote`, {
            params: {
                user:username, 
                access:access
            }
        })
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching notes user: ', error);
        throw error;
    }
}

export async function getUserSelectNote(username, access){
    console.log(username)
    try {
        const response = await axios.get(`http://localhost:8000/api/note/getUserSelectNote`, {
            params: {
                user:username, 
                access:access
            }
        })
        return response.data;
    } catch (error) {
        console.error('Error fetching notes user: ', error);
        throw error;
    }
}
    
  
