const state = JSON.parse(sessionStorage.getItem('state'))

document.addEventListener('DOMContentLoaded', () => {
    console.log('here')
    updateProjects()
});

// HOME
// Get the parent container
const projectListElement = document.getElementById('homeLayout');

async function updateProjects() {
    const projects = await window.getProjectsByUser(state._id)
    displayProjects(projects)
}

// Loop through projects and create divs
function displayProjects(projects) {
    projects.forEach(project => {
        // Create a new div for each project
        const projectDiv = document.createElement('div');
        projectDiv.classList.add("px-4", "py-2", "bg-white", "rounded-md", "border", "border-third", "w-3/4", "sm:w-1/2", "cursor-pointer");
        
        // Add content to the div
        projectDiv.innerHTML = `
            <p>${project.name}</p>
        `;
        
        // Append the div to the parent container
        projectListElement.appendChild(projectDiv);
    });
}

// CREATE PROJECT
//--------------------------------------------------------------
const createProjectError = document.getElementById("createProjectError")
const newProjectUsers = [];
const newProjectIds = []

// create project form submit
document.getElementById('createProjectForm').addEventListener('submit', async function(event) {
    // prevent default refresh
    event.preventDefault();

    // create
    if (newProjectStartElem.value == '' || newProjectEndElem.value == '') {
        createProjectError.innerHTML = 'Start and end date must be selected'
    }
    else {
        const newProjectStartDate = new Date(newProjectStartElem.value)
        const newProjectEndDate = new Date(newProjectEndElem.value)
        if (newProjectEndDate.getTime() <= newProjectStartDate.getTime()) {
            createProjectError.innerHTML = 'End date must be after start date'
        }
        else {
            const selectedUsersIds = newProjectIds.concat(state._id)
            const milestoneActivityProjectData = {
                projectId: null,
                isMilestone: true,
                subActivities: null
            }
            const finalMilestoneName = document.getElementById("finalMilestoneName").value
            const newProjectName = document.getElementById("newProjectName").value
            const newProjectDescription = document.getElementById("newProjectDescription").value
            // create milestone activity
            const milestoneActivity = await postActivity(finalMilestoneName,  
                newProjectEndDate, selectedUsersIds, milestoneActivityProjectData)
            // create project
            const createdProject = await createProject(newProjectName, newProjectDescription, 
                newProjectStartDate, newProjectEndDate, state._id, selectedUsersIds, [milestoneActivity._id])
            // update milestone activity with created project ids
            await updateActivityProjectId(milestoneActivity._id, createdProject._id)
            createProjectError.innerHTML = ''
        }
    }
});

const newProjectStartElem = document.getElementById('newProjectStart');
flatpickr(newProjectStartElem, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

const newProjectEndElem = document.getElementById('newProjectEnd');
flatpickr(newProjectEndElem, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

function showCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.open()
        newProjectUsers.length = 0
        newProjectIds.length = 0
        document.getElementById('createProjectForm').reset();
    }
}

function closeCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.close();
    }
}

async function addUserToNewProjectList() {
    const userToAddInput = document.getElementById("newProjectUsersInput")
    let exists = false
    let user_id = ''
    //TODO: check if it's different than current user (need to get current user)
    if (userToAddInput.value !== '' && userToAddInput.value !== state.username && !newProjectUsers.includes(userToAddInput.value)) {
        const existsObject = await window.userExists(userToAddInput.value)
        exists = existsObject.exists
        user_id = existsObject.id
    }
    if (exists) {
        newProjectUsers.push(userToAddInput.value)
        newProjectIds.push(user_id)
        userToAddInput.value = ''
        updateNewProjectUsersInput()
        console.log('here')
        console.log(user_id)
    }
}

function updateNewProjectUsersInput() {
    const addedUsernamesInput = document.getElementById("newProjectAddedUsernamesInput")
    addedUsernamesInput.value = newProjectUsers.join(', ')
}

function clearNewProjectUsers() {

}

// ADD ACTIVITY
//--------------------------------------------------------------
const newActivityUsers = [];

function showAddActivityModal() {
    const modal = document.getElementById('addActivityModal');
    if (modal) {
        modal.open()
        newActivityUsers.length = 0
        document.getElementById('addActivityForm').reset();
    }
}

function closeAddActivityModal() {
    const modal = document.getElementById('addActivityModal');
    if (modal) {
        modal.close();
    }
}

// add activity form submit
document.getElementById('addActivityForm').addEventListener('submit', function(event) {
    // prevent default refresh
    event.preventDefault();

    // add activity
});

const activityDeadlineElem = document.getElementById('activityDeadline');
flatpickr(activityDeadlineElem, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

async function addUserToNewActivityList() {
    const userToAddInput = document.getElementById("newActivityUsersInput")
    let exists = false
    //TODO: check if it's different than current user (need to get current user)
    if (userToAddInput.value !== '' && userToAddInput.value !== state.username 
            && !newActivityUsers.includes(userToAddInput.value))
        exists = await window.userExists(userToAddInput.value)
    if (exists) {
        newActivityUsers.push(userToAddInput.value)
        userToAddInput.value = ''
        updateNewActivityUsersInput()
    }
}

function updateNewActivityUsersInput() {
    const addedUsernamesInput = document.getElementById("newActivityAddedUsernamesInput")
    addedUsernamesInput.value = newActivityUsers.join(', ')
}

function clearNewActivityUsers() {
    newActivityUsers.length = 0
    updateNewActivityUsersInput()
}