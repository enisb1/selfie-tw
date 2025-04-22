import axios from 'axios';

export async function createProject(name, description, start, end, owner, members, activities) {
    try {
        const response = await axios.post('https://site232418.tw.cs.unibo.it/api/projects/createProject', {
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

export async function getProjectsByUser(userId) {
    try {
        const response = await axios.get(`https://site232418.tw.cs.unibo.it/api/projects/projectsByUser/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export async function addActivityToProject(projectId, activityId) {
    try {
        const response = await axios.put(`https://site232418.tw.cs.unibo.it/api/projects/addActivityToProject/${projectId}`, { activityId });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

// Get project details by ID
export async function getProjectDetails(projectId) {
    try {
        const response = await axios.get(`https://site232418.tw.cs.unibo.it/api/projects/${projectId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching project details: ", error);
        throw error;
    }
}