// CREATE PROJECT
//--------------------------------------------------------------
function showCreateModal() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.open()
        document.getElementById('createProjectForm').reset();
    }
}

function closeCreateModal() {
    const modal = document.getElementById('createProjectModal');
    if (modal) {
        modal.close();
    }
}

// create project form submit
document.getElementById('createProjectForm').addEventListener('submit', function(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Your custom logic here
    console.log('Form submitted, but default action prevented!');
});

const projectDeadlineElem = document.getElementById('projectDeadline');
flatpickr(projectDeadlineElem, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

const newProjectUsers = [];
async function addUserToNewProjectList() {
    const userToAddInput = document.getElementById("userToAddInput")
    let exists = false
    if (userToAddInput.value !== '' && !newProjectUsers.includes(userToAddInput.value))
        exists = await window.userExists(userToAddInput.value)
    if (exists) {
        newProjectUsers.push(userToAddInput.value)
        userToAddInput.value = ''
        updateAddedUsernamesInput()
    }
}

function updateAddedUsernamesInput() {
    const addedUsernamesInput = document.getElementById("addedUsernamesInput")
    addedUsernamesInput.value = newProjectUsers.join(', ')
}

function clearProjectUsers() {
    newProjectUsers.length = 0
    updateAddedUsernamesInput()
}