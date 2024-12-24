// CREATE PROJECT
//--------------------------------------------------------------
const createProjectError = document.getElementById("createProjectError")

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

function createProject() {
    console.log('he')
}

function showCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.open()
    }
}

// create project form submit
document.getElementById('createProjectForm').addEventListener('submit', function(event) {
    // prevent default refresh
    event.preventDefault();

    // create
    if (newProjectStartElem.value == '' || newProjectEndElem.value == '') {
        createProjectError.innerHTML = 'Start and end date must be selected'
    }
    else {
        const startDate = new Date(newProjectStartElem.value)
        const endDate = new Date(newProjectEndElem.value)
        if (endDate.getTime() <= startDate.getTime()) {
            createProjectError.innerHTML = 'End date must be after start date'
        }
        else {
            createProjectError.innerHTML = ''
        }
    }
});

function closeCreateProjectModal() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.close();
    }
}

const newProjectUsers = [];
async function addUserToNewProjectList() {
    const userToAddInput = document.getElementById("newProjectUsersInput")
    let exists = false
    //TODO: check if it's different than current user (need to get current user)
    if (userToAddInput.value !== '' && !newProjectUsers.includes(userToAddInput.value))
        exists = await window.userExists(userToAddInput.value)
    if (exists) {
        newProjectUsers.push(userToAddInput.value)
        userToAddInput.value = ''
        updateNewProjectUsersInput()
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
function showAddActivityModal() {
    const modal = document.getElementById('addActivityModal');
    if (modal) {
        modal.open()
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

const newActivityUsers = [];
async function addUserToNewActivityList() {
    const userToAddInput = document.getElementById("newActivityUsersInput")
    let exists = false
    //TODO: check if it's different than current user (need to get current user)
    if (userToAddInput.value !== '' && !newActivityUsers.includes(userToAddInput.value))
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