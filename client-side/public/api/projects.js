async function userExists(username) {
    try {
        const response = await fetch(`http://localhost:8000/api/login/userExists/${username}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return { exists: data.exists, id: data.id };
    } catch (error) {
        throw new Error(`Error checking user existence: ${error.message}`);
    }
}

// post event to db using fetch
async function postActivity(title, deadline, userIds, projectData) {
    try {
        const response = await fetch('http://localhost:8000/api/calendar/addActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                deadline: deadline,
                isDone: false,
                users: userIds,
                projectData: projectData
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data, which includes the activity ID
    } catch (error) {
        throw new Error(`Error posting activity: ${error.message}`);
    }
}

async function createProject(name, description, start, end, owner, members, activities) {
    try {
        const response = await fetch('http://localhost:8000/api/projects/createProject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                start: start,
                end: end,
                owner: owner,
                members: members,
                activities: activities
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        throw new Error(`Error creating project: ${error.message}`);
    }
}

async function updateActivityProjectId(activityId, projectId) {
    try {
        const response = await fetch(`http://localhost:8000/api/calendar/updateActivityProjectId/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                projectId: projectId
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        throw new Error(`Error updating activity project ID: ${error.message}`);
    }
}

async function getProjectsByUser(userId) {
    try {
        const response = await fetch(`http://localhost:8000/api/projects/projectsByUser/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        throw new Error(`Error fetching projects by user: ${error.message}`);
    }
}

// adding methods to window to make them accessible globally
window.userExists = userExists;
window.postActivity = postActivity;
window.createProject = createProject;
window.updateActivityProjectId = updateActivityProjectId;
window.getProjectsByUser = getProjectsByUser;