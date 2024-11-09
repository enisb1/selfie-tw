import axios from "axios";

export async function postNote(title, bodyNote, bodyTask, category, format, access) {
    await axios.post('http://localhost:8000/api/note/addNote', {"title": title, "bodyNote": bodyNote, "bodyTask": bodyTask, 
                                                                "category": category, "format": format, "access": access
    })
    .then(({data}) => {
        console.log(data);
    })
}

export async function getNotes() {
    try {
        const response = await axios.get('http://localhost:8000/api/note/getNote');
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching notes: ', error);
        throw error;
    }
}

export async function deleteNoteById(id) {
    try{
        const response = await axios.delete(`http://localhost:8000/api/note/${id}`, {
            method: 'DELETE',
    })
        return response.data;
    }catch (error){
        console.error("Error deleting Note: ", error)

    }
}

export async function getNoteById(id) {
    try {
        const response = await axios.get(`http://localhost:8000/api/note/singleNote/${id}`)
        return response.data       
    } catch (error) {
        console.error("Error retrieving note: ", error)
        throw error
    }
}

export async function updateNoteById(id, updatedData) {
    try {
      const response = await axios.put(`http://localhost:8000/api/note/edit/${id}`, updatedData);
      return response.data; 
    } catch (error) {
      console.error('Errore nell\'aggiornamento della nota:', error);
      throw error;
    }
  }
