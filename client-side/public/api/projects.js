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
        const response = await fetch('http://localhost:8000/api/calendar/addActivityNoInvite', {
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

async function getActivitiesByProject(projectId) {
    try {
        const response = await fetch(`http://localhost:8000/api/projects/activitiesByProject/${projectId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        throw new Error(`Error fetching activities by project: ${error.message}`);
    }
}

async function addActivityToProject(projectId, activityId) {
    try {
        const response = await fetch(`http://localhost:8000/api/projects/addActivityToProject/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ activityId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        throw new Error(`Error adding activity to project: ${error.message}`);
    }
}

async function getUsers(userIds) {
    try {
        const response = await fetch('http://localhost:8000/api/login/getUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userIds })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
}

async function editActivity(activityId, updatedData) {
    try {
        const response = await fetch(`http://localhost:8000/api/calendar/activities/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        throw new Error(`Error editing activity: ${error.message}`);
    }
}

async function getActivitiesByIds(activityIds) {
    try {
        const response = await fetch('http://localhost:8000/api/calendar/getActivitiesByIds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ activityIds })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        throw new Error(`Error fetching activities: ${error.message}`);
    }
}

async function deleteActivity(activityId) {
    try {
        const response = await fetch(`http://localhost:8000/api/calendar/activities/${activityId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        console.error(`Error deleting activity: ${error.message}`);
        throw error;
    }
}

async function updateWaitingActivable(activityId, output) {
    try {
        const response = await fetch(`http://localhost:8000/api/projects/updateWaitingActivable/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ output })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        console.error(`Error updating activities: ${error.message}`);
        throw error;
    }
}

async function editProject(projectId, projectData, notificationMessage) {
    try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({projectData, notificationMessage})
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        console.error(`Error updating project: ${error.message}`);
        throw error;
    }
}

async function updateActivityStartDate(activityId, newStartDate) {
    try {
        const response = await fetch(`http://localhost:8000/api/projects/editStartDate/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ compressedStartDate: newStartDate })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        console.error('Error updating activity start date:', error);
    }
}

async function updateActivityDeadline(activityId, newDeadline) {
    try {
        const response = await fetch(`http://localhost:8000/api/projects/editDeadline/${activityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ originalEndDate: newDeadline })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        console.error('Error updating activity deadline date:', error);
    }
}

async function deleteProject(projectId) {
    try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; // Return the response data
    } catch (error) {
        console.error("Error deleting project: ", error);
        throw error;
    }
}

// adding methods to window to make them accessible globally
window.userExists = userExists;
window.postActivity = postActivity;
window.createProject = createProject;
window.updateActivityProjectId = updateActivityProjectId;
window.getProjectsByUser = getProjectsByUser;
window.getActivitiesByProject = getActivitiesByProject;
window.addActivityToProject = addActivityToProject;
window.getUsers = getUsers;
window.editActivity = editActivity;
window.getActivitiesByIds = getActivitiesByIds;
window.updateActivityStartDate = updateActivityStartDate;
window.updateActivityDeadline = updateActivityDeadline;
window.deleteActivity = deleteActivity;
window.updateWaitingActivable = updateWaitingActivable;
window.editProject = editProject;
window.deleteProject = deleteProject;