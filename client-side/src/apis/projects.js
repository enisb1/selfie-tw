import axios from 'axios';

export async function createProject(name, description, start, end, owner, members, activities) {
    try {
        const response = await axios.post('http://localhost:8000/api/projects/createProject', {
            name: name,
            description: description,
            start: start,
            end: end,
            owner: owner,
            members: members,
            activities: activities
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}