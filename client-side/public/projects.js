const state = JSON.parse(sessionStorage.getItem('state'))

document.addEventListener('DOMContentLoaded', () => {
    updateProjects()
});

const homeView = document.getElementById('homeLayout');
const homeProjectsList = document.getElementById('homeProjectsList');
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
let currentProject = null;
let currentEditedActivity = null;
let activityNumber = 0;

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
    activityNumber = 0
    displayToDoActivities(activities.filter(activity => activity.projectData.status === 'activable' || activity.projectData.status === 'waitingActivable'))
    displayInProgressActivities(activities.filter(activity => activity.projectData.status === 'active' || activity.projectData.status === 'reactivated' || activity.projectData.status === 'overdue'))
    displayCompletedActivities(activities.filter(activity => activity.projectData.status === 'done' || activity.projectData.status === 'discarded'))
}

function displayToDoActivities(activities) {
    const todoActivitiesContainer = document.getElementById('todoActivitiesContainer')
    todoActivitiesContainer.innerHTML = ''
    activities.forEach(async (activity) => {
        // Create a new div for each project
        const activityDiv = document.createElement('div');
        activityDiv.classList.add("w-full", "flex", "items-center", "mt-2", "text-secondary", "font-semibold");
        const users = await window.getUsers(activity.users)
        let startString = new Date(activity.projectData.startDate).toLocaleDateString("it-IT", infoDateFormat)
        let deadlineString = new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)
        // Add content to the div
        activityDiv.innerHTML = `
            <!-- title -->
            <div class="w-2/12 truncate">
                <span>${activity.title}</span>
            </div>
            <!-- users -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${users.map(u => u.username).join(", ")}</span>
            </div>
            <!-- start -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${startString}</span>
            </div>
            <!-- deadline -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${deadlineString}</span>
            </div>
            <!-- milestone or not-->
            <div class="w-1/12 border-l border-secondary truncate">
                <span class="ml-1">${activity.projectData.isMilestone? 'Milestone' : 'Normal'}</span>
            </div>
            <!-- status -->
            <div class="w-2/12 border-l border-secondary truncate">
                <div class="inline-block px-2 py-1 border-l border-secondary bg-secondary text-white 
                    ml-1 rounded-md">
                    ${activity.projectData.status}
                </div>
            </div>
            <div class="w-1/12 border-l border-secondary">
                <button class="ml-1 w-6 h-6" id="infoActivity${activityNumber}"><img src="./assets/information.png"></img></button>
                <button class="w-6 h-6 mr-2" id="editActivity${activityNumber}"><img src="./assets/edit_vector.png"></img></button>
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
            currentEditedActivity = activity
            showEditActivityModal()
        });

        activityNumber++;
    });
}

function displayInProgressActivities(activities) {
    const inProgressActivitiesContainer = document.getElementById('inProgressActivitiesContainer')
    inProgressActivitiesContainer.innerHTML = ''
    activities.forEach(async (activity) => {
        // Create a new div for each project
        const activityDiv = document.createElement('div');
        activityDiv.classList.add("w-full", "flex", "items-center", "mt-2", "text-secondary", "font-semibold");
        const users = await window.getUsers(activity.users)
        const startString = new Date(activity.projectData.startDate).toLocaleDateString("it-IT", infoDateFormat)
        const deadlineString = new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)
        // Add content to the div
        activityDiv.innerHTML = `
            <!-- title -->
            <div class="w-2/12 truncate">
                <span>${activity.title}</span>
            </div>
            <!-- users -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${users.map(u => u.username).join(", ")}</span>
            </div>
            <!-- start -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${startString}</span>
            </div>
            <!-- deadline -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${deadlineString}</span>
            </div>
            <!-- milestone or not-->
            <div class="w-1/12 border-l border-secondary truncate">
                <span class="ml-1">${activity.projectData.isMilestone? 'Milestone' : 'Normal'}</span>
            </div>
            <!-- status -->
            <div class="w-2/12 border-l border-secondary truncate">
                <div class="inline-block px-2 py-1 border-l border-secondary bg-secondary text-white 
                    ml-1 rounded-md">
                    ${activity.projectData.status}
                </div>
            </div>
            <div class="w-1/12 border-l border-secondary">
                <button class="ml-1 w-6 h-6" id="infoActivity${activityNumber}"><img src="./assets/information.png"></img></button>
                <button class="w-6 h-6 mr-2" id="editActivity${activityNumber}"><img src="./assets/edit_vector.png"></img></button>
            </div>
        `;
        const hr = document.createElement('hr');
        hr.classList.add("border-gray-400", "border", "mt-px")

        // Append the div to the parent container
        inProgressActivitiesContainer.appendChild(activityDiv);
        inProgressActivitiesContainer.appendChild(hr)

        const infoButton = document.getElementById(`infoActivity${activityNumber}`);
        infoButton.addEventListener('click', () => {
            showInfoModal(activity)
        });

        const editButton = document.getElementById(`editActivity${activityNumber}`);
        editButton.addEventListener('click', () => {
            currentEditedActivity = activity
            showEditActivityModal()
        });

        activityNumber++;
    });
}

function displayCompletedActivities(activities) {
    const finishedActivitiesContainer = document.getElementById('finishedActivitiesContainer')
    finishedActivitiesContainer.innerHTML = ''
    activities.forEach(async (activity) => {
        // Create a new div for each project
        const activityDiv = document.createElement('div');
        activityDiv.classList.add("w-full", "flex", "items-center", "mt-2", "text-secondary", "font-semibold");
        const users = await window.getUsers(activity.users)
        const startString = new Date(activity.projectData.startDate).toLocaleDateString("it-IT", infoDateFormat)
        const deadlineString = new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)
        // Add content to the div
        activityDiv.innerHTML = `
            <!-- title -->
            <div class="w-2/12 truncate">
                <span>${activity.title}</span>
            </div>
            <!-- users -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${users.map(u => u.username).join(", ")}</span>
            </div>
            <!-- start -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${startString}</span>
            </div>
            <!-- deadline -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${deadlineString}</span>
            </div>
            <!-- milestone or not-->
            <div class="w-1/12 border-l border-secondary truncate">
                <span class="ml-1">${activity.projectData.isMilestone? 'Milestone' : 'Normal'}</span>
            </div>
            <!-- status -->
            <div class="w-2/12 border-l border-secondary truncate">
                <div class="inline-block px-2 py-1 border-l border-secondary bg-secondary text-white 
                    ml-1 rounded-md">
                    ${activity.projectData.status}
                </div>
            </div>
            <!-- info and edit buttons -->
            <div class="w-1/12 border-l border-secondary">
                <button class="ml-1 w-6 h-6" id="infoActivity${activityNumber}"><img src="./assets/information.png"></img></button>
                <button class="w-6 h-6 mr-2" id="editActivity${activityNumber}"><img src="./assets/edit_vector.png"></img></button>
            </div>
        `;
        const hr = document.createElement('hr');
        hr.classList.add("border-gray-400", "border", "mt-px")

        // Append the div to the parent container
        finishedActivitiesContainer.appendChild(activityDiv);
        finishedActivitiesContainer.appendChild(hr)

        const infoButton = document.getElementById(`infoActivity${activityNumber}`);
        infoButton.addEventListener('click', () => {
            showInfoModal(activity)
        });

        const editButton = document.getElementById(`editActivity${activityNumber}`);
        editButton.addEventListener('click', () => {
            currentEditedActivity = activity
            showEditActivityModal()
        });

        activityNumber++;
    });
}

const editedActivityUsers = []
const editedActivityIds = []

async function showInfoModal(activity) {
    const modal = document.getElementById('infoActivityModal');
    if (modal) {
        document.getElementById('infoActivityModalTitle').innerHTML = activity.title
        document.getElementById('infoActivityTitle').innerHTML = activity.title
        document.getElementById('infoActivityStatus').innerHTML = activity.projectData.status
        document.getElementById('infoActivityPhase').innerHTML = activity.projectData.phase
        document.getElementById('infoActivityDeadline').innerHTML = new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)
        const users = await window.getUsers(activity.users)
        document.getElementById('infoActivityUsers').innerHTML = users.map(u => u.username).join(", ")
        document.getElementById('infoActivityMilestone').innerHTML = activity.projectData.isMilestone? 'yes' : 'no'
        document.getElementById('infoActivityContracts').innerHTML = activity.projectData.contracts? 'yes' : 'no'
        //TODO: show phase
        modal.open()
    }
}

async function addUserToEditedActivityList() {
    const userToAddInput = document.getElementById("editActivityUsersInput")
    let exists = false
    let user_id = ''
    const activityToEditError = document.getElementById("activityToEditError")
    //TODO: check if it's not already contained in current activity, and check if it's contained in project
    // and if it's != from current user... if all of this is correct then OK!
    if (userToAddInput.value !== '' && userToAddInput.value !== state.username && 
        !editedActivityUsers.includes(userToAddInput.value)) {
        const existsObject = await window.userExists(userToAddInput.value)
        exists = existsObject.exists
        user_id = existsObject.id
    }
    // check if it's in current project and if it's NOT contained in current activity (else it would duplicate)
    if (exists && currentProject.members.includes(user_id)) {
        console.log('here')
        editedActivityUsers.push(userToAddInput.value)
        editedActivityIds.push(user_id)
        userToAddInput.value = ''
        activityToEditError.innerHTML = ''
        updateEditedActivityAddedUsersInput()
    }
    else {
        activityToEditError.innerHTML = "User not valid"
    }

}

// add activity form submit
document.getElementById('editActivityForm').addEventListener('submit', async function(event) {
    // prevent default refresh
    event.preventDefault();

    // add activity
    const newActivity = structuredClone(currentEditedActivity)
    // check what is not empty and update that  
    // update activities list
    newActivity.projectData.isMilestone = document.getElementById("activityToEditIsMilestone").checked
    newActivity.title = document.getElementById("activityToEditTitle").value
    newActivity.projectData.phase = document.getElementById("activityToEditPhase").value
    newActivity.users = newActivity.users.concat(editedActivityIds)
    newActivity.projectData.status = document.getElementById("activityToEditStatusSelect").value
    newActivity.projectData.contracts = document.getElementById("activityToEditContracts").checked
    // set correct isDone
    if (newActivity.projectData.status == 'done')
        newActivity.isDone = true
    else
        newActivity.isDone = false
    await window.editActivity(newActivity._id, newActivity)
    updateProjectActivities()
    closeEditActivityModal()
});

function updateEditedActivityAddedUsersInput() {
    const addedUsernamesInput = document.getElementById("editActivityAddedUsernamesInput")
    addedUsernamesInput.value = editedActivityUsers.join(', ')
}

function showEditActivityModal() {
    const modal = document.getElementById('editActivityModal');
    if (modal) {
        //TODO: se sei CAPO PROGETTO puoi decidere se l'attività TRASLA O CONTRAE
        // in caso di ritardo dell'attività prima
        modal.open()
        editedActivityUsers.length = 0
        editedActivityIds.length = 0
        document.getElementById('editActivityForm').reset();
        document.getElementById("activityToEditError").innerHTML = ''
        document.getElementById("activityToEditTitle").value = currentEditedActivity.title
        document.getElementById("activityToEditPhase").value = currentEditedActivity.projectData.phase
        document.getElementById("activityToEditIsMilestone").checked = currentEditedActivity.projectData.isMilestone
        document.getElementById("activityToEditContracts").checked = currentEditedActivity.projectData.contracts
        const statusSelect = document.getElementById("activityToEditStatusSelect")
        statusSelect.innerHTML = '' // reset from previous options
        let statuses = []
        // modify statuses also for other values of status
        if (currentEditedActivity.projectData.status == 'waitingActivable')
            statuses = ['waitingActivable']
        else if (currentEditedActivity.projectData.status == 'activable')
            statuses = ['activable', 'active', 'done']
        else if (currentEditedActivity.projectData.status == 'active')
            statuses = ['active', 'done']
        else if (currentEditedActivity.projectData.status == 'reactivated')
            statuses = ['reactivated', 'done']
        else if (currentEditedActivity.projectData.status == 'overdue')
            statuses = ['overdue', 'done']
        else if (currentEditedActivity.projectData.status == 'done')
            statuses = ['done', 'reactivated'] //TODO: reactivated only if you are the project manager
        else if (currentEditedActivity.projectData.status == 'discarded')
            statuses = ['discarded']
        statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            statusSelect.appendChild(option);
        });
    }
}

function closeInfoActivityModal() {
    const modal = document.getElementById('infoActivityModal');
    if (modal) {
        modal.close()
    }
}

function closeEditActivityModal() {
    const modal = document.getElementById('editActivityModal');
    if (modal) {
        modal.close()
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
    document.getElementById('todoActivitiesContainer').innerHTML = ''
    document.getElementById('inProgressActivitiesContainer').innerHTML = ''
    document.getElementById('finishedActivitiesContainer').innerHTML = ''
}

async function updateProjects() {
    const projects = await window.getProjectsByUser(state._id)
    displayProjects(projects)
}

// Loop through projects and create divs
function displayProjects(projects) {
    homeProjectsList.innerHTML = ''
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
        homeProjectsList.appendChild(projectDiv);
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
    if (userToAddInput.value !== '' && userToAddInput.value !== state.username && !newProjectUsers.includes(userToAddInput.value)) {
        const existsObject = await window.userExists(userToAddInput.value)
        exists = existsObject.exists
        user_id = existsObject.id
    }
    if (exists && currentProject.members.includes(user_id)) {
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
        document.getElementById('activityToAddError').innerHTML = ''
    }
}

function closeAddActivityModal() {
    const modal = document.getElementById('addActivityModal');
    if (modal) {
        modal.close();
    }
}

const activityToAddStartElem = document.getElementById('activityToAddStart');
flatpickr(activityToAddStartElem, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

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
    const activityToAddContracts = document.getElementById("activityToAddContracts")
    const activityToAddError = document.getElementById("activityToAddError")
    const activityToAddPhase = document.getElementById("activityToAddPhase")
    const projectStart = new Date(currentProject.start)
    const projectEnd = new Date(currentProject.end)
    const activityToAddDeadlineValue = new Date(activityToAddDeadlineElem.value)
    const activityToAddStartValue = new Date(activityToAddStartElem.value)
    if (activityToAddStartValue === '') {
        activityToAddError.innerHTML = "Start date is needed"
    }
    else if (activityToAddDeadlineValue === '') {
        activityToAddError.innerHTML = "Deadline is needed"
    }
    else if (activityToAddStartValue.getTime() <= projectStart.getTime()
        || activityToAddStartValue.getTime() >= projectEnd.getTime()) {
        activityToAddError.innerHTML = "Start must be between project start and end date"
    }
    else if (activityToAddDeadlineValue.getTime() <= projectStart.getTime()
        || activityToAddDeadlineValue.getTime() >= projectEnd.getTime()) {
        activityToAddError.innerHTML = "Deadline must be between project start and end date"
    }
    else if (activityToAddDeadlineValue.getTime() <= activityToAddStartValue.getTime()) {
        activityToAddError.innerHTML = "Deadline must be after activity's start"
    }
    else {
        const activityUsers = newActivityIds.concat(state._id)
        //TODO: set correct status based on previous activity (if previous activity is done it means
        //it has output, hence the new activity can be activable, else it must be waitingActivable)
        //TODO: make creation of set of activities possible
        const projectData = {
            startDate: activityToAddStartValue,
            projectId: currentProject._id,
            isMilestone: activityToAddIsMilestone.checked,
            phase: activityToAddPhase.value,
            status: 'activable',
            contracts: activityToAddContracts.checked
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