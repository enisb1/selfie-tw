import axios from "axios";

export async function postCategory(title) {
    await axios.post('http://localhost:8000/api/category/addCategory', {"title": title})   
}

export async function getCategory() {
    try {
        const response = await axios.get('http://localhost:8000/api/category/getCategory');
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching notes: ', error);
        throw error;
    }
}

export async function deleteCategoryById(id) {
    try{
        const response = await axios.delete(`http://localhost:8000/api/category/${id}`, {
            method: 'DELETE',
    })
        return response.data;
    }catch (error){
        console.error("Error deleting Category: ", error)

    }
}
