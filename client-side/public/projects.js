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

function goToProjectView(projectId, projectName) {
    homeView.classList.add('hidden')
    projectView.classList.remove('hidden')
    updateProjectActivities(projectId)
    goToOverviewPage()
    projectViewName.innerHTML = projectName
}

/*
<div v-for="activity in todoActivities" :key="activity._id" class="mt-2 text-secondary font-semibold">
    <div class="w-full flex items-center">
        <!-- title -->
        <div class="w-2/5">{{ activity.title }}</div>
        <!-- deadline -->
        <div class="w-1/5 border-l border-secondary">
        <span class="ml-1">{{ new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat) }}</span>
        </div>
        <!-- milestone or not-->
        <div class="w-1/5 border-l border-secondary">
        <span class="ml-1">{{ activity.projectData.milestone? 'Milestone' : 'Normal' }}</span>
        </div>
        <!-- status -->
        <div class="w-1/5 border-l border-secondary">
        <div class="inline-block px-2 py-1 border-l border-secondary bg-secondary text-white 
            ml-1 rounded-md">
            {{ activity.projectData.status }}
        </div>
        </div>  
    </div>
    <hr class="border-gray-400 border mt-px">
</div>
*/

async function updateProjectActivities(projectId) {
    const activities = await window.getActivitiesByProject(projectId)
    displayToDoActivities(activities.filter(activity => activity.status === 'activable' || 'waitingActivable'))
}

function displayToDoActivities(activities) {
    todoActivitiesContainer.innerHTML = ''
    activities.forEach(activity => {
        // Create a new div for each project
        const activityDiv = document.createElement('div');
        activityDiv.classList.add("w-full", "flex", "items-center", "mt-2", "text-secondary", "font-semibold");
        
        // Add content to the div
        activityDiv.innerHTML = `
            <!-- title -->
            <div class="w-2/5 truncate"><span>${activity.title}</span></div>
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
        
        // Append the div to the parent container
        todoActivitiesContainer.appendChild(activityDiv);
    });
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
            goToProjectView(project._id, project.name)
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