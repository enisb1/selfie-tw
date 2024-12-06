import axios from "axios";

export async function postNote(title, bodyNote, bodyTask, category, format, access, type, user) {
    await axios.post('http://localhost:8000/api/note/addNote', {"title": title, "bodyNote": bodyNote, "bodyTask": bodyTask, 
                                                                "category": category, "format": format, "access": access,
                                                                "type": type, "user": user
    })
    .then(({data}) => {
        console.log(data);
    })
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
    
  
