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
const ganttPage = document.getElementById('ganttPage');
const settingsPage = document.getElementById('settingsPage');
const settingsTitle = document.getElementById('settingsTitle');
const overviewTitle = document.getElementById('overviewTitle')
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

async function updateProjectActivities(alphabeticalOrder) {
    let activities = await window.getActivitiesByProject(currentProject._id)
    if (alphabeticalOrder) {
        activities = activities.sort((a, b) => {
            const usersA = [...a.users].sort().join(","); // Sort and join for comparison
            const usersB = [...b.users].sort().join(",");
            return usersA.localeCompare(usersB); // Compare alphabetically
        });
    }
    else {
        activities = activities.sort((a, b) => new Date(a.projectData.startDate) - new Date(b.projectData.startDate));
    }
    activityNumber = 0
    displayToDoActivities(activities.filter(activity => activity.projectData.status === 'activable' || activity.projectData.status === 'waitingActivable'))
    displayInProgressActivities(activities.filter(activity => activity.projectData.status === 'active' || activity.projectData.status === 'reactivated' || activity.projectData.status === 'overdue'))
    displayCompletedActivities(activities.filter(activity => activity.projectData.status === 'done' || activity.projectData.status === 'discarded'))
}

async function displayToDoActivities(activities) {
    const todoActivitiesContainer = document.getElementById('todoActivitiesContainer');
    todoActivitiesContainer.innerHTML = '';
    const activitiesForPhase = {};

    // Group activities by phase
    for (const activity of activities) {
        if (!activitiesForPhase[activity.projectData.phase]) {
            activitiesForPhase[activity.projectData.phase] = [activity];
        } else {
            activitiesForPhase[activity.projectData.phase].push(activity);
        }
    }

    // Iterate over each phase and its activities
    for (const [phase, phaseActivities] of Object.entries(activitiesForPhase)) {
        // Create a header for the phase
        const phaseParagraph = document.createElement('p');
        phaseParagraph.classList.add("mt-2", "text-secondary", "font-semibold", "bg-secondary", "text-white", "inline-block", "rounded-md", "p-1");
        phaseParagraph.innerText = phase;
        todoActivitiesContainer.appendChild(phaseParagraph);

        // Iterate over each activity in the phase
        for (const activity of phaseActivities) {
            // Create a new div for each project
            const activityDiv = document.createElement('div');
            activityDiv.classList.add("w-full", "flex", "items-center", "mt-2", "text-secondary", "font-semibold");

            const users = await window.getUsers(activity.users);
            let startString = new Date(activity.projectData.startDate).toLocaleDateString("it-IT", infoDateFormat);
            let deadlineString = new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat);

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
                    <div class="ml-1">
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
        }
    }
}

async function displayInProgressActivities(activities) {
    const inProgressActivitiesContainer = document.getElementById('inProgressActivitiesContainer');
    inProgressActivitiesContainer.innerHTML = '';
    const activitiesForPhase = {};

    // Group activities by phase
    for (const activity of activities) {
        if (!activitiesForPhase[activity.projectData.phase]) {
            activitiesForPhase[activity.projectData.phase] = [activity];
        } else {
            activitiesForPhase[activity.projectData.phase].push(activity);
        }
    }

    // Iterate over each phase and its activities
    for (const [phase, phaseActivities] of Object.entries(activitiesForPhase)) {
        // Create a header for the phase
        const phaseParagraph = document.createElement('p');
        phaseParagraph.classList.add("mt-2", "text-secondary", "font-semibold", "bg-secondary", "text-white", "inline-block", "rounded-md", "p-1");
        phaseParagraph.innerText = phase;
        inProgressActivitiesContainer.appendChild(phaseParagraph);

        // Iterate over each activity in the phase
        for (const activity of phaseActivities) {
            // Create a new div for each project
            const activityDiv = document.createElement('div');
            activityDiv.classList.add("w-full", "flex", "items-center", "mt-2", "text-secondary", "font-semibold");

            const users = await window.getUsers(activity.users);
            let startString = new Date(activity.projectData.startDate).toLocaleDateString("it-IT", infoDateFormat);
            let deadlineString = new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat);

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
                    <div class="ml-1">
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
        }
    }
}

async function displayCompletedActivities(activities) {
    const finishedActivitiesContainer = document.getElementById('finishedActivitiesContainer');
    finishedActivitiesContainer.innerHTML = '';
    const activitiesForPhase = {};

    // Group activities by phase
    for (const activity of activities) {
        if (!activitiesForPhase[activity.projectData.phase]) {
            activitiesForPhase[activity.projectData.phase] = [activity];
        } else {
            activitiesForPhase[activity.projectData.phase].push(activity);
        }
    }

    // Iterate over each phase and its activities
    for (const [phase, phaseActivities] of Object.entries(activitiesForPhase)) {
        // Create a header for the phase
        const phaseParagraph = document.createElement('p');
        phaseParagraph.classList.add("mt-2", "text-secondary", "font-semibold", "bg-secondary", "text-white", "inline-block", "rounded-md", "p-1");
        phaseParagraph.innerText = phase;
        finishedActivitiesContainer.appendChild(phaseParagraph);

        // Iterate over each activity in the phase
        for (const activity of phaseActivities) {
            // Create a new div for each project
            const activityDiv = document.createElement('div');
            activityDiv.classList.add("w-full", "flex", "items-center", "mt-2", "text-secondary", "font-semibold");

            const users = await window.getUsers(activity.users);
            let startString = new Date(activity.projectData.startDate).toLocaleDateString("it-IT", infoDateFormat);
            let deadlineString = new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat);

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
                    <div class="ml-1">
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
        }
    }
}

const editedActivityUsers = []
const editedActivityIds = []

function onClickAlphabetOrderButton() {
    const alphabetOrderButton = document.getElementById("alphabetOrderButton")
    const alphabetOrderImageBlack = document.getElementById("alphabetOrderBlack")
    const alphabetOrderImageWhite = document.getElementById("alphabetOrderWhite")
    if (alphabetOrderButton.classList.contains("bg-white")) {
        alphabetOrderButton.classList.remove("bg-white")
        alphabetOrderButton.classList.add("bg-secondary")
        alphabetOrderImageBlack.classList.add("hidden")
        alphabetOrderImageWhite.classList.remove("hidden")
        updateProjectActivities(true)
    }
    else {
        alphabetOrderButton.classList.remove("bg-secondary")
        alphabetOrderButton.classList.add("bg-white")
        alphabetOrderImageBlack.classList.remove("hidden")
        alphabetOrderImageWhite.classList.add("hidden")
        updateProjectActivities(false)
    }
}

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

    const activityToEditError = document.getElementById("activityToEditError")
    const previousActivitySelect = document.getElementById("previousActivitySelectEdit")
    const previousActivitySelectValue = JSON.parse(previousActivitySelect.value)
    console.log(previousActivitySelectValue)
    if (previousActivitySelectValue != 'Select previous activity' && 
            previousActivitySelectValue.projectData.phase !== currentEditedActivity.projectData.phase) {
                activityToEditError.innerHTML = "Synced activities must have the same phase"
    }
    else if (previousActivitySelectValue!= 'Select previous activity' && 
            new Date(previousActivitySelectValue.deadline).getTime() > new Date(currentEditedActivity.projectData.startDate).getTime()) {
                activityToEditError.innerHTML = "New activity must start after previous activity's deadline"
    }
    else {
        // add activity
        const newActivity = structuredClone(currentEditedActivity)
        // check what is not empty and update that  
        // update activities list
        newActivity.projectData.isMilestone = document.getElementById("activityToEditIsMilestone").checked
        newActivity.title = document.getElementById("activityToEditTitle").value
        newActivity.users = newActivity.users.concat(editedActivityIds)
        newActivity.projectData.status = document.getElementById("activityToEditStatusSelect").value
        newActivity.projectData.previous = previousActivitySelectValue!= 'Select previous activity'? previousActivitySelectValue._id : null
        newActivity.projectData.contracts = document.getElementById("activityToEditContracts").checked
        // set correct isDone
        if (newActivity.projectData.status == 'done')
            newActivity.isDone = true
        else
            newActivity.isDone = false
        await window.editActivity(newActivity._id, newActivity)
        updateProjectActivities()
        closeEditActivityModal()
    }
});

function updateEditedActivityAddedUsersInput() {
    const addedUsernamesInput = document.getElementById("editActivityAddedUsernamesInput")
    addedUsernamesInput.value = editedActivityUsers.join(', ')
}

async function showEditActivityModal() {
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

        // previous activity select
        const activities = await window.getActivitiesByProject(currentProject._id)
        let activitiesSamePhase = activities.filter(activity => activity.projectData.phase == currentEditedActivity.projectData.phase)
        const selectElement = document.getElementById('previousActivitySelectEdit');
        selectElement.innerHTML = '' // reset from previous options
        const opt = document.createElement('option');
        opt.value = 'Select previous activity';
        activitiesSamePhase.forEach((activity) => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify(activity);
            opt.textContent = activity.title;
            selectElement.appendChild(opt);
        });
        selectElement.value = JSON.stringify(activitiesSamePhase.find(activity => currentEditedActivity.projectData.previous == activity._id))
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

function goToSettingsPage() {
    settingsPage.classList.remove("hidden")
    overviewPage.classList.add("hidden")
    ganttPage.classList.add("hidden")
    // highlight overview title
    settingsTitle.classList.add("border-b-4", "border-secondary")
    overviewTitle.classList.remove("border-b-4", "border-secondary")
    ganttTitle.classList.remove("border-b-4", "border-secondary")
}

function goToOverviewPage() {
    overviewPage.classList.remove("hidden")
    settingsPage.classList.add("hidden")
    ganttPage.classList.add("hidden")
    // highlight overview title
    settingsTitle.classList.remove("border-b-4", "border-secondary")
    overviewTitle.classList.add("border-b-4", "border-secondary")
    ganttTitle.classList.remove("border-b-4", "border-secondary")
}

function goToGanttPage() {
    overviewPage.classList.add("hidden")
    settingsPage.classList.add("hidden")
    ganttPage.classList.remove("hidden")
    // highlight gantt title
    settingsTitle.classList.remove("border-b-4", "border-secondary")
    overviewTitle.classList.remove("border-b-4", "border-secondary")
    ganttTitle.classList.add("border-b-4", "border-secondary")
    ritardCalc(currentProject._id, currentProject.start)
    createGrid(currentProject._id, currentProject.start)
    createSettingsPage(currentProject._id, currentProject.name, currentProject.start, currentProject.description)
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
            goToProjectView(project);
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

async function showAddActivityModal() {
    const modal = document.getElementById('addActivityModal');
    if (modal) {
        modal.open()
        newActivityUsers.length = 0
        document.getElementById('addActivityForm').reset();
        document.getElementById('activityToAddError').innerHTML = ''
        let activities = await window.getActivitiesByProject(currentProject._id)
        const selectElement = document.getElementById('previousActivitySelectAdd');
        selectElement.innerHTML = '' // reset from previous options
        const opt = document.createElement('option');
        opt.value = 'Select previous activity';
        activities.forEach((activity) => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify(activity);
            opt.textContent = activity.title;
            selectElement.appendChild(opt);
        });
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

function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}

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
    const previousActivitySelect = document.getElementById("previousActivitySelectAdd")
    const previousActivitySelectValue = JSON.parse(previousActivitySelect.value)
    if (!isValidDate(activityToAddStartValue)) {
        activityToAddError.innerHTML = "Start date is needed"
    }
    else if (!isValidDate(activityToAddStartValue)) {
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
    else if (previousActivitySelectValue!= 'Select previous activity' && 
            previousActivitySelectValue.projectData.phase !== activityToAddPhase.value) {
        activityToAddError.innerHTML = "Synced activities must have the same phase"
    }
    else if (previousActivitySelectValue!= 'Select previous activity' && 
            new Date(previousActivitySelectValue.deadline).getTime() > activityToAddStartValue.getTime()) {
        activityToAddError.innerHTML = "New activity must start after previous activity's deadline"
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
            contracts: activityToAddContracts.checked,
            previous: previousActivitySelect.value? JSON.parse(previousActivitySelect.value)._id : null
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

//GANTT 
//--------------------------------------

function getDayFromISODate(isoDateString) {
    // Spezza la stringa ISO per ottenere la parte della data
    const datePart = isoDateString.split("T")[0]; // "2024-12-26"
    const day = datePart.split("-")[2]; // Prende la terza parte (il giorno)
    return parseInt(day, 10); // Converte il giorno in un numero
}

function formatISODate(isoDateString) {
    const date = new Date(isoDateString);

    // Estrarre ore e minuti
    const hours = date.getUTCHours().toString().padStart(2, '0'); // Ora in formato 24 ore
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    // Giorno
    const day = date.getUTCDate();

    // Mese (in formato abbreviato)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];

    // Anno
    const year = date.getUTCFullYear();

    return `${hours}:${minutes} ${day} ${month} ${year}`;
}

function formatDateToDayMonth(dateString) {
    const date = new Date(dateString); // Converte la stringa in un oggetto Date
    const day = date.getDate(); // Ottiene il giorno
    const month = date.toLocaleString("en-US", { month: "short" }); // Ottiene il mese abbreviato (es. "Dec")
    return `${day} ${month}`;
}

function extractTimeFromDate(dateString) {
    const date = new Date(dateString); // Converte la stringa in oggetto Date
    const hours = date.getHours().toString().padStart(2, '0'); // Estrai le ore, aggiungi lo 0 se necessario
    return `${hours}`; // Combina ore e minuti in formato HH:mm
}

function getFullIsoDifference(date1, date2) {
    const date1Time = new Date(date1).getTime();
    const date2Time = new Date(date2).getTime();
    
    // Calcola la differenza in millisecondi
    const differenceInMs = Math.abs(date1Time - date2Time);

    // Calcola giorni, ore, minuti, secondi
    const days = Math.floor(differenceInMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((differenceInMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((differenceInMs % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((differenceInMs % (60 * 1000)) / 1000);

    // Formatta in uno stile simile a ISO
    return `P${days}D${hours.toString().padStart(2, '0')}H${minutes.toString().padStart(2, '0')}M${seconds.toString().padStart(2, '0')}S`;
}

function addDurationToDate(isoDate, duration) {
    const date = new Date(isoDate);
    
    // Estrarre la durata
    const durationRegex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
    const match = duration.match(durationRegex);
    if (!match) {
        throw new Error("Durata non valida");
    }

    const days = parseInt(match[1] || 0);
    const hours = parseInt(match[2] || 0);
    const minutes = parseInt(match[3] || 0);
    const seconds = parseInt(match[4] || 0);

    // Sommare la durata alla data
    date.setUTCDate(date.getUTCDate() + days);
    date.setUTCHours(date.getUTCHours() + hours);
    date.setUTCMinutes(date.getUTCMinutes() + minutes);
    date.setUTCSeconds(date.getUTCSeconds() + seconds);

    // Restituire la nuova data in formato ISO
    return date.toISOString();
}

let newDeadline = [];
async function ritardCalc(projectId, projectStart){
    const project = await window.getActivitiesByProject(projectId);
    const nowDate = "2025-01-05T19:00:00.000+00:00";
    //const nowDate = new Date();
    let isNormal = false
    let count = 2;
    let isoDelay = "";

    project.slice().reverse().forEach((activity, index) => {
        if(project.length === 1 && nowDate > activity.deadline && activity.isDone === false){
            console.log("ATTIVITA SCADUTA")  
        }
        else if(nowDate > activity.deadline && activity.isDone === false && index+1 < project.length){
            if(project[project.length-count].projectData.isMilestone === true){
                newDeadline[index] = nowDate
                console.log("RITARDO + NEXT MILESTONE")
                
            }else{
                isoDelay =  getFullIsoDifference(activity.deadline, nowDate)
                
                if(isNormal === false){
                    newDeadline[index] = nowDate
                    isNormal = true
                
                }else{
                    const deadlineUploaded =  addDurationToDate(activity.deadline, isoDelay)
                    newDeadline[index] = deadlineUploaded
                }

                
                console.log("quella dopo è chill")
            }
           
    
        }else if(isNormal=== true){
                
                const deadlineUploaded =  addDurationToDate(activity.deadline, isoDelay)    
                newDeadline[index] = deadlineUploaded
                if(project[project.length-count].projectData.isMilestone === true){
                    isNormal = false
                }
            
        }else{
            newDeadline[index] = activity.deadline
            console.log("TUTTO GIUSTO")
            
        }
        count++
        })
        
};

function isDateInArray(dateToCompare, datesArray) {
    // Estrai anno, mese e giorno dalla data da confrontare
    const compareDate = new Date(dateToCompare);
    const yearToCompare = compareDate.getUTCFullYear();
    const monthToCompare = compareDate.getUTCMonth(); // Il mese è zero-indicizzato (0 = gennaio, 11 = dicembre)
    const dayToCompare = compareDate.getUTCDate();

    // Confronta con ciascun elemento dell'array
    for (let date of datesArray) {
        const currentDate = new Date(date);
        const year = currentDate.getUTCFullYear();
        const month = currentDate.getUTCMonth();
        const day = currentDate.getUTCDate();

        // Se anno, mese e giorno sono uguali, restituisci true
        if (yearToCompare === year && monthToCompare === month && dayToCompare === day) {
            return true;
        }
    }

    // Se non è stato trovato nessun match, restituisci false
    return false;
}

function sortByDate(dates) {
    return dates.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        
        // Confronta prima l'anno, poi il mese, infine il giorno
        const yearA = dateA.getUTCFullYear();
        const monthA = dateA.getUTCMonth(); // Il mese è zero-indicizzato (0 = gennaio, 11 = dicembre)
        const dayA = dateA.getUTCDate();
        
        const yearB = dateB.getUTCFullYear();
        const monthB = dateB.getUTCMonth();
        const dayB = dateB.getUTCDate();
        
        // Confronta anno
        if (yearA !== yearB) {
            return yearA - yearB;
        }
        
        // Se l'anno è uguale, confronta mese
        if (monthA !== monthB) {
            return monthA - monthB;
        }
        
        // Se mese e anno sono uguali, confronta giorno
        return dayA - dayB;
    });
}

  

async function createGrid(projectId, projectStart) {

    const project = await window.getActivitiesByProject(projectId)

    const ganttContainer = document.getElementById('ganttPage');
    ganttContainer.innerHTML = '';

    ganttContainer.classList.add("flex");

    const containerFixedGrid = document.createElement("div");
    containerFixedGrid.classList.add("w-1/2");

    ganttContainer.appendChild(containerFixedGrid);

    const navTitle = document.createElement("div");
    navTitle.classList.add("bg-white", "text-secondary", "font-bold", "grid", "grid-cols-4", "divide-x", "divide-white");
    navTitle.innerHTML = `
       <div class="bg-secondary text-white text-center truncate"><span>Title</span></div>
       <div class="bg-secondary text-white text-center truncate"><span>Owner</span></div>
       <div class="bg-secondary text-white text-center truncate"><span>Start</span></div>
       <div class="bg-secondary text-white text-center truncate"><span>End</span></div>
    
    `;

    containerFixedGrid.appendChild(navTitle);

    let count = 2;
     
    project.slice().reverse().forEach((activity, index) => {

        let startDate;
        if(index === 0){
            startDate = projectStart;
            
        }else{
            startDate = project[project.length-count].projectData.startDate;
            count = count + 1;
        }    

        

        const taskGrid = document.createElement("div");
        taskGrid.classList.add("bg-white", "text-secondary", "font-bold", "grid", "grid-cols-4", "divide-x", "divide-y", "divide-secondary");
        taskGrid.innerHTML = ` 
            <div class="truncate text-center"><span>${activity.title}</span></div>
            <div class="truncate text-center"><span>${activity.users}</span></div>
            <div class="truncate text-center"><span>${formatDateToDayMonth(startDate)}</span></div>
            <div class="truncate text-center"><span>${formatDateToDayMonth(activity.deadline)}</span></div>

        `;
        containerFixedGrid.appendChild(taskGrid);
        
    });
    const dayGrid = document.createElement("div");
    dayGrid.classList.add("relative", "w-1/2", "bg-white", "text-white", "font-bold", "grid", "grid-flow-col", "divide-x", "divide-white", "overflow-x-scroll");

    const dates = [];
    let countx = 1;
    let county = 2;
    project.slice().reverse().forEach((activity, index) => {
        let startDate;
        let pStart;
        let actualMonth;

        pStart = new Date(projectStart);
        actualMonth = pStart.getMonth() + 1;
                
       /* if(index === 0){
            startDate = projectStart;
            dates.push(startDate);
            const startDayDiv = document.createElement("div");
            startDayDiv.innerHTML = `
                <div class="truncate text-center min-w-24 bg-secondary"><span>${formatDateToDayMonth(startDate)}</span></div>
            `;
            dayGrid.appendChild(startDayDiv);
            if(startDate !== activity.deadline){
                dates.push(newDeadline[index])
                const deadlineDiv = document.createElement("div");
                deadlineDiv.innerHTML = `
                <div class="truncate text-center min-w-24 bg-secondary"><span>${formatDateToDayMonth(newDeadline[index])}</span></div>
                `;
                dayGrid.appendChild(deadlineDiv);
            }    
        }else{*/
            startDate = project[project.length-countx].projectData.startDate;
            pStart = new Date(activity.deadline);
            console.log(startDate)
            if(isDateInArray(startDate, dates) === false){
                dates.push(startDate)
                
            }
            if(isDateInArray(newDeadline[index], dates) === false){
                dates.push(newDeadline[index])
                
            } 
            countx++ 
        
  
    
        if(index === project.length-1){
            const colorGrid = document.createElement("div");
            colorGrid.classList.add("absolute", "left-0", "top-6", "right-2", "bg-white", "grid", "divide-y", "divide-x", "divide-secondary");
            colorGrid.style.gridTemplateColumns =  `repeat(${dates.length}, minmax(96px, 1fr))`;
            colorGrid.style.gridTemplateRows =  `repeat(${project.length}, minmax(0, 1fr))`;
            
            let actualyStart = projectStart;
            let stato = "";
            let hours = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
            let inActivityTime = false;
            

            project.slice().reverse().forEach((activity, index) => {
                const sortDates = sortByDate(dates);
                sortDates.forEach((d => {
                    let classe = "";
                    let hourStart = extractTimeFromDate(actualyStart) -1
                    let hourEnd = extractTimeFromDate(newDeadline[index]) -1 
                    const colorDiv = document.createElement("div");
                    colorDiv.classList.add("truncate", "text-center", "min-w-24", "grid", "grid-cols-24");
                    

                hours.forEach((hour) => {
                if(((formatDateToDayMonth(actualyStart) === formatDateToDayMonth(d) && hourStart === hour)|| (formatDateToDayMonth(newDeadline[index]) === formatDateToDayMonth(d) && hourEnd === hour))){
                    
                    if(inActivityTime === false){
                        inActivityTime = true;
                        stato = "colorato"
                        classe = "bg-red-500";
                    }else{
                        inActivityTime = false;
                        stato = "biancoo"
                        classe = "bg-white";   
                    }
                     
                }else{
                    
                    if(inActivityTime === false){
                        stato = "biancoo"
                        classe = "bg-white";
                        
                    }else{
                        stato = "colorato"
                        classe = "bg-red-500";
                        
                    }   
                }
        
                const hourDiv = document.createElement("div");
                hourDiv.classList.add("truncate", "text-center", "min-w-24", classe);

                hourDiv.innerHTML = `<div>&nbsp;</div>`
                colorDiv.appendChild(hourDiv);
            });
            
            colorGrid.appendChild(colorDiv);
                
            }))
            
            if(project.length > county){
            actualyStart = project[project.length-county].projectData.startDate
            }else if(project.length === county){
                actualyStart = project[0].projectData.startDate
            }
            inActivityTime = false;
            county++
        })
        dayGrid.appendChild(colorGrid)
        }
    });
    const sortDates = sortByDate(dates);
    dates.forEach((sortDates) => {
        const dayDiv = document.createElement("div");
            dayDiv.innerHTML = `
            <div class="truncate text-center min-w-24 bg-secondary"><span>${formatDateToDayMonth(sortDates)}</span></div>
            `;
            dayGrid.appendChild(dayDiv);
    })
        ganttContainer.appendChild(dayGrid);
}

//SETTINGS
//---------------------------------------------------------------------
function createSettingsPage(projectId, nameProject, startProject, descriptionProject){
    settingsPage.innerHTML = ''
    const titleProject = document.createElement("div");
    titleProject.classList.add("w-3/4", "h-1/2");
    titleProject.innerHTML = `
                <div class="p-6 px-8 text-3xl text-secondary font-bold"><span>${nameProject}</span></div>
            `;


    settingsPage.appendChild(titleProject);

}