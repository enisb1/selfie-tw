const state = JSON.parse(sessionStorage.getItem('state'))

document.addEventListener('DOMContentLoaded', () => {
    updateProjects()
});

const homeView = document.getElementById('homeLayout');
const projectView = document.getElementById('projectLayout');

const infoDateFormat = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // (12 hour format)
}

// PROJECT VIEW
//--------------------------------------------------------------
const overviewPage = document.getElementById('overviewPage');
const listPage = document.getElementById('listPage');
const ganttPage = document.getElementById('ganttPage');
const overviewTitle = document.getElementById('overviewTitle')
const listTitle = document.getElementById('listTitle')
const ganttTitle = document.getElementById('ganttTitle')
const projectViewName = document.getElementById('projectViewName')
const todoActivitiesContainer = document.getElementById('todoActivitiesContainer')
let currentProject = null;

function goToProjectView(project) {
    currentProject = project; // UPDATE current project data
    homeView.classList.add('hidden')
    projectView.classList.remove('hidden')
    updateProjectActivities()
    goToOverviewPage()
    projectViewName.innerHTML = project.name
}

async function updateProjectActivities() {
    const activities = await window.getActivitiesByProject(currentProject._id)
    displayToDoActivities(activities.filter(activity => activity.status === 'activable' || 'waitingActivable'))
}

function displayToDoActivities(activities) {
    todoActivitiesContainer.innerHTML = ''
    let activityNumber = 0
    activities.forEach(activity => {
        // Create a new div for each project
        const activityDiv = document.createElement('div');
        activityDiv.classList.add("w-full", "flex", "items-center", "mt-2", "text-secondary", "font-semibold");
        
        // Add content to the div
        activityDiv.innerHTML = `
            <!-- title -->
            <div class="w-2/5 truncate"><span>${activity.title}</span></div>
            <button class="ml-2 w-6 h-6" id="infoActivity${activityNumber}"><img src="./assets/information.png"></img></button>
            <button class="ml-2 w-6 h-6 mr-2" id="editActivity${activityNumber}"><img src="./assets/edit_vector.png"></img></button>
            <!-- deadline -->
            <div class="w-1/5 border-l border-secondary truncate">
                <span class="ml-1">${new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)}</span>
            </div>
            <!-- milestone or not-->
            <div class="w-1/5 border-l border-secondary truncate">
                <span class="ml-1">${activity.projectData.isMilestone? 'Milestone' : 'Normal'}</span>
            </div>
            <!-- status -->
            <div class="w-1/5 border-l border-secondary truncate">
                <div class="inline-block px-2 py-1 border-l border-secondary bg-secondary text-white 
                    ml-1 rounded-md">
                    ${activity.projectData.status}
                </div>
            </div>
        `;
        const hr = document.createElement('hr');
        hr.classList.add("border-gray-400", "border", "mt-px")

        // Append the div to the parent container
        todoActivitiesContainer.appendChild(activityDiv);
        todoActivitiesContainer.appendChild(hr)

        const infoButton = document.getElementById(`infoActivity${activityNumber}`);
        infoButton.addEventListener('click', () => {
            showInfoModal(activity)
        });

        const editButton = document.getElementById(`editActivity${activityNumber}`);
        editButton.addEventListener('click', () => {
            showEditModal()
        });

        activityNumber++;
    });
}

async function showInfoModal(activity) {
    const modal = document.getElementById('infoActivityModal');
    if (modal) {
        document.getElementById('infoActivityModalTitle').innerHTML = activity.title
        document.getElementById('infoActivityTitle').innerHTML = activity.title
        document.getElementById('infoActivityDeadline').innerHTML = new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)
        const users = await window.getUsers(activity.users)
        document.getElementById('infoActivityUsers').innerHTML = users.map(u => u.username).join(", ")
        document.getElementById('infoActivityMilestone').innerHTML = activity.projectData.isMilestone? 'yes' : 'no'
        const infoActivityDeadline = document.getElementById('infoActivityDeadline')
        const infoActivityUsers = document.getElementById('infoActivityUsers')
        const infoActivityMilestone = document.getElementById('infoActivityMilestone')
        modal.open()
    }
}

function showEditModal() {
    const modal = document.getElementById('editActivityModal');
    if (modal) {
        modal.open()
        //document.getElementById('createProjectForm').reset();
    }
}

function closeInfoModal() {
    const modal = document.getElementById('infoActivityModal');
    if (modal) {
        modal.close()
        //document.getElementById('createProjectForm').reset();
    }
}

function closeEditModal() {
    const modal = document.getElementById('editActivityModal');
    if (modal) {
        modal.close()
        //document.getElementById('createProjectForm').reset();
    }
}

function goToOverviewPage() {
    overviewPage.classList.remove("hidden")
    listPage.classList.add("hidden")
    ganttPage.classList.add("hidden")
    // highlight overview title
    overviewTitle.classList.add("border-b-4", "border-secondary")
    listTitle.classList.remove("border-b-4", "border-secondary")
    ganttTitle.classList.remove("border-b-4", "border-secondary")
}

function goToListPage() {
    overviewPage.classList.add("hidden")
    listPage.classList.remove("hidden")
    ganttPage.classList.add("hidden")
    // highlight list title
    overviewTitle.classList.remove("border-b-4", "border-secondary")
    listTitle.classList.add("border-b-4", "border-secondary")
    ganttTitle.classList.remove("border-b-4", "border-secondary")
}

function goToGanttPage() {
    overviewPage.classList.add("hidden")
    listPage.classList.add("hidden")
    ganttPage.classList.remove("hidden")
    // highlight gantt title
    overviewTitle.classList.remove("border-b-4", "border-secondary")
    listTitle.classList.remove("border-b-4", "border-secondary")
    ganttTitle.classList.add("border-b-4", "border-secondary")
}

// HOME VIEW
//--------------------------------------------------------------
// Get the parent container

function goToHomeView() {
    homeView.classList.remove('hidden')
    projectView.classList.add('hidden')
}

async function updateProjects() {
    const projects = await window.getProjectsByUser(state._id)
    displayProjects(projects)
}

// Loop through projects and create divs
function displayProjects(projects) {
    homeView.innerHTML = ''
    projects.forEach(project => {
        // Create a new div for each project
        const projectDiv = document.createElement('div');
        projectDiv.classList.add("px-4", "py-2", "bg-white", "rounded-md", "border", "border-third", "w-3/4", "sm:w-1/2", "cursor-pointer");
        
        // Add content to the div
        projectDiv.innerHTML = `
            <p>${project.name}</p>
        `;

        // Add click listener to the project div
        projectDiv.addEventListener('click', () => {
            // Handle the click event
            console.log(`Project clicked: ${project.name}`);
            // You can add more actions here, such as navigating to a project detail page
            goToProjectView(project)
        });
        
        // Append the div to the parent container
        homeView.appendChild(projectDiv);
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
                subActivities: null,
                status: 'activable'
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
            closeCreateProjectModal()
            updateProjects()
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
    }
}

function updateNewProjectUsersInput() {
    const addedUsernamesInput = document.getElementById("newProjectAddedUsernamesInput")
    addedUsernamesInput.value = newProjectUsers.join(', ')
}

// ADD ACTIVITY
//--------------------------------------------------------------
const newActivityUsers = [];
const newActivityIds = [];

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

const activityToAddDeadlineElem = document.getElementById('activityToAddDeadline');
flatpickr(activityToAddDeadlineElem, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

// add activity form submit
document.getElementById('addActivityForm').addEventListener('submit', async function(event) {
    // prevent default refresh
    event.preventDefault();

    // add activity
    const activityToAddTitle = document.getElementById("activityToAddTitle")
    const activityToAddIsMilestone = document.getElementById("activityToAddIsMilestone")
    const activityToAddError = document.getElementById("activityToAddError")
    const projectStart = new Date(currentProject.start)
    const projectEnd = new Date(currentProject.end)
    const activityToAddDeadlineValue = new Date(activityToAddDeadlineElem.value)
    if (activityToAddDeadlineValue.getTime() <= projectStart.getTime()
        || activityToAddDeadlineValue.getTime() >= projectEnd.getTime()) {
        activityToAddError.innerHTML = "Deadline must be between project start and end date"
    }
    else {
        const activityUsers = newActivityIds.concat(state._id)
        //TODO: set correct status based on previous activity (if previous activity is done it means
        //it has output, hence the new activity can be activable, else it must be waitingActivable)
        //TODO: make creation of set of activities possible
        const projectData = {
            projectId: currentProject._id,
            isMilestone: activityToAddIsMilestone.checked,
            subActivities: null,
            status: 'activable'
        }
        const createdActivity = await window.postActivity(activityToAddTitle.value, activityToAddDeadlineValue, 
            activityUsers, projectData)
        await window.addActivityToProject(currentProject._id, createdActivity._id)
        activityToAddError.innerHTML = ""
        closeAddActivityModal()
        updateProjectActivities()
    }
});

async function addUserToNewActivityList() {
    const userToAddInput = document.getElementById("newActivityUsersInput")
    let exists = false
    let user_id = ''
    // TODO: check if it's different from current user and also if it's
    // contained in the project's ids
    if (userToAddInput.value !== '' && userToAddInput.value !== state.username 
            && !newActivityUsers.includes(userToAddInput.value)) {
        const existsObject = await window.userExists(userToAddInput.value)
        exists = existsObject.exists
        user_id = existsObject.id
    }       
    if (exists) {
        newActivityUsers.push(userToAddInput.value)
        newActivityIds.push(user_id)
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