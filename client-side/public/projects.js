const state = JSON.parse(sessionStorage.getItem('state'))

// time machine
const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
}
const currentDateTimeMachine = document.getElementById('timeMachineCurrentDateValue')
currentDateTimeMachine.innerHTML = formatDate(new Date())
setInterval(async () => {
    currentDateTimeMachine.innerHTML = formatDate(new Date())
}, 1000)

function showTimeMachineModal() {
    const modal = document.getElementById('timeMachineModal');
    if (modal) {
        modal.open()
    }
}

document.getElementById('openTimeMachineButton').addEventListener('click', () => {
    showTimeMachineModal()
})

const timeMachineDateSelector = document.getElementById('timeMachineDateSelector');
const dateSelectorFlatpickr = flatpickr(timeMachineDateSelector, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minuteIncrement: 1,
});

// --- end time machine

updateProjects()
if (!state.isAdmin) {
    document.getElementById('adminNavLink').classList.add('hidden')
    document.getElementById('adminNavLinkDropdown').classList.add('hidden')
}

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
    displayInProgressActivities(activities.filter(activity => activity.projectData.status === 'active' || activity.projectData.status === 'reactivated'))
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
                <div class="hidden sm:block w-2/12 border-l border-secondary truncate">
                    <span class="ml-1">${users.map(u => u.username).join(", ")}</span>
                </div>
                <!-- start -->
                <div class="hidden sm:block w-2/12 border-l border-secondary truncate">
                    <span class="ml-1">${startString}</span>
                </div>
                <!-- deadline -->
                <div class="hidden sm:block w-2/12 border-l border-secondary truncate">
                    <span class="ml-1">${deadlineString}</span>
                </div>
                <!-- milestone or not-->
                <div class="hidden sm:block w-1/12 border-l border-secondary truncate">
                    <span class="ml-1">${activity.projectData.isMilestone? 'Milestone' : 'Normal'}</span>
                </div>
                <!-- status -->
                <div class="hidden sm:block w-2/12 border-l border-secondary truncate">
                    <div class="ml-1">
                        ${activity.projectData.status}
                    </div>
                </div>
                <div class="flex pl-1 gap-1 sm:border-l border-secondary">
                    <button class="w-6 h-6" id="infoActivity${activityNumber}"><img src="./assets/information.png"></img></button>
                    <button class="w-6 h-6" id="editActivity${activityNumber}"><img src="./assets/edit_vector.png"></img></button>
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
            
            const deadlineDate = new Date(activity.deadline);
            let tenDaysAfterDeadline = new Date(deadlineDate);
            tenDaysAfterDeadline.setDate(deadlineDate.getDate() + 10)
            let status = activity.projectData.status
            if (new Date(activity.deadline).getTime() < new Date().getTime() &&
                tenDaysAfterDeadline.getTime() < new Date().getTime() && status != 'reactivated')
                status = 'discarded'
            else if (new Date(activity.deadline).getTime() < new Date().getTime() && status != 'reactivated')
                status = 'overdue'
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
                        ${status}
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
        document.getElementById('infoActivityInput').innerHTML = (activity.projectData.input == '')? '*empty*' : activity.projectData.input
        document.getElementById('infoActivityOutput').innerHTML = (activity.projectData.output == '')? '*empty*' : activity.projectData.output
        //TODO: show previous activity
        let previousAct = null
        if (activity.projectData.previous) {
            const result = await window.getActivitiesByIds([activity.projectData.previous])
            previousAct = result[0]
        }
        document.getElementById('infoActivityPrevious').innerHTML = previousAct? previousAct.title : 'none'
        
        // Reset the click event listener for the delete button
        const deleteButton = document.getElementById("infoActivityDelete");
        const newDeleteButton = deleteButton.cloneNode(true);
        deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);
        newDeleteButton.addEventListener('click', async () => {
            await window.deleteActivity(activity._id);
            updateProjectActivities();
            closeInfoActivityModal();
        });

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
    let previousActivitySelectValue = null
    if (previousActivitySelect.value)
        previousActivitySelectValue = JSON.parse(previousActivitySelect.value)

    if (previousActivitySelectValue && previousActivitySelectValue != 'Select previous activity' && 
            previousActivitySelectValue.projectData.phase !== currentEditedActivity.projectData.phase) {
                activityToEditError.innerHTML = "Synced activities must have the same phase"
    }
    else if (previousActivitySelectValue && previousActivitySelectValue!= 'Select previous activity' && 
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
        newActivity.projectData.previous = (previousActivitySelectValue && previousActivitySelectValue!= 'Select previous activity')? previousActivitySelectValue._id : null
        newActivity.projectData.contracts = document.getElementById("activityToEditContracts").checked
        newActivity.projectData.input = document.getElementById("activityToEditInput").value
        newActivity.projectData.output = document.getElementById("activityToEditOutput").value
        // set correct isDone
        if (newActivity.projectData.status == 'done') {
            newActivity.isDone = true
            //TODO: all the activities that have this activity as previous must have status set to 'activable' if they're status is 'waitingActivable'
            await window.updateWaitingActivable(newActivity._id, newActivity.projectData.output)
        }
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

const editedProjectStartElem = document.getElementById('editedProjectStart');
const startFlatpickr = flatpickr(editedProjectStartElem, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

const editedProjectEndElem = document.getElementById('editedProjectEnd');
const endFlatpickr = flatpickr(editedProjectEndElem, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});

document.getElementById('editProjectButton').addEventListener('click', () => {
    showEditProjectModal()
})

document.getElementById('hamburgerMenuButton').addEventListener('click', () => {
    document.getElementById('hamburgerMenu').classList.toggle('hidden')
})

window.addEventListener('resize', () => {
    if (window.innerWidth > 640) {
        const menu = document.getElementById('hamburgerMenu')
        if (!menu.classList.contains('hidden')) {
            menu.classList.add('hidden')
        }
    }
})

const editedProjectUsers = [];
const editedProjectIds = []

function updateEditedProjectUsersInput() {
    const addedUsernamesInput = document.getElementById("editedProjectAddedUsernamesInput")
    addedUsernamesInput.value = editedProjectUsers.join(', ')
}

function clearEditedProjectUsers() {
    editedProjectUsers.length = 0
    updateEditedProjectUsersInput()
}

async function addUserToEditedProjectList() {
    const userToAddInput = document.getElementById("editedProjectUsersInput")
    let exists = false
    let user_id = ''
    if (userToAddInput.value !== '' && userToAddInput.value !== state.username && !editedProjectUsers.includes(userToAddInput.value)) {
        const existsObject = await window.userExists(userToAddInput.value)
        exists = existsObject.exists
        user_id = existsObject.id
    }
    
    if (exists && !currentProject.members.includes(user_id)) {
        editedProjectUsers.push(userToAddInput.value)
        editedProjectIds.push(user_id)
        userToAddInput.value = ''
        updateEditedProjectUsersInput()
        document.getElementById("editedProjectError").innerHTML = ""
    } else {
        document.getElementById("editedProjectError").innerHTML = "User doesn't exist or is already in the project"
    }
}

function showEditProjectModal() {
    const modal = document.getElementById('editProjectModal');
    if (modal) {
        document.getElementById('editProjectForm').reset();
        editedProjectUsers.length = 0
        editedProjectIds.length = 0
        document.getElementById('editedProjectName').value = currentProject.name
        document.getElementById('editedProjectDescription').value = currentProject.description
        document.getElementById('editedProjectError').innerHTML = ''
        const startDate = new Date(currentProject.start);
        const endDate = new Date(currentProject.end);
        
        // Set dates in Flatpickr
        startFlatpickr.setDate(startDate, true);
        endFlatpickr.setDate(endDate, true);
        modal.open()
    }
}

function closeEditProjectModal() {
    const modal = document.getElementById('editProjectModal');
    if (modal) {
        modal.close()
    }
}

document.getElementById('editProjectForm').addEventListener('submit', async function(event) {
    // prevent default refresh
    event.preventDefault();

    const editProjectError = document.getElementById("editedProjectError")
    const name = document.getElementById('editedProjectName').value
    const description = document.getElementById('editedProjectDescription').value
    const startValue = new Date(editedProjectStartElem.value)
    const endValue = new Date(editedProjectEndElem.value)
    if (startValue.getTime() > new Date(currentProject.start).getTime()) {
        editProjectError.innerHTML = 'Start date cannot be after the current start date'
    }
    else if (endValue.getTime() < new Date(currentProject.end).getTime()) {
        editProjectError.innerHTML = 'End date cannot be before the current end date'
    }
    else {
        const newProject = structuredClone(currentProject)
        newProject.name = name
        newProject.description = description
        newProject.start = startValue
        newProject.end = endValue
        newProject.members = newProject.members.concat(editedProjectIds)
        await window.editProject(newProject._id, newProject)
        currentProject = newProject
        projectViewName.innerHTML = currentProject.name
        updateSettingsPage()
        closeEditProjectModal()
    }
});

document.getElementById('deleteProjectButton').addEventListener('click', async () => {
    await window.deleteProject(currentProject._id)
    updateProjects()
    goToHomeView()
});


async function showEditActivityModal() {
    const modal = document.getElementById('editActivityModal');
    if (modal) {
        //TODO: se sei CAPO PROGETTO puoi decidere se l'attività TRASLA O CONTRAE
        // in caso di ritardo dell'attività prima
        editedActivityUsers.length = 0
        editedActivityIds.length = 0
        
        document.getElementById('editActivityForm').reset();
        document.getElementById("activityToEditError").innerHTML = ''
        document.getElementById("activityToEditTitle").value = currentEditedActivity.title
        document.getElementById("activityToEditIsMilestone").checked = currentEditedActivity.projectData.isMilestone
        document.getElementById("activityToEditContracts").checked = currentEditedActivity.projectData.contracts
        document.getElementById("activityToEditInput").value = currentEditedActivity.projectData.input
        document.getElementById("activityToEditOutput").value = currentEditedActivity.projectData.output
        const statusSelect = document.getElementById("activityToEditStatusSelect")
        statusSelect.innerHTML = '' // reset from previous options
        let statuses = []

        // modify statuses also for other values of status
        const inputContainer = document.getElementById("activityToEditInputContainer")
        const outputContainer = document.getElementById("activityToEditOutputContainer")
        const deadlineDate = new Date(currentEditedActivity.deadline);
        let tenDaysAfterDeadline = new Date(deadlineDate);
        tenDaysAfterDeadline.setDate(deadlineDate.getDate() + 10)
        if (currentEditedActivity.projectData.status == 'waitingActivable') {
            statuses = ['waitingActivable']
            inputContainer.classList.add('hidden')
            outputContainer.classList.add('hidden')
        }   
        else if (currentEditedActivity.projectData.status == 'activable') {
            statuses = ['activable', 'active']
            inputContainer.classList.remove('hidden')
            outputContainer.classList.add('hidden')
        }
        else if (currentEditedActivity.projectData.status == 'active' && new Date(currentEditedActivity.deadline).getTime() < new Date().getTime() &&
            tenDaysAfterDeadline.getTime() < new Date().getTime()) {
            statuses = ['discarded', 'done']
            inputContainer.classList.remove('hidden')
            outputContainer.classList.remove('hidden')
        }
        else if (currentEditedActivity.projectData.status == 'active' && new Date(currentEditedActivity.deadline).getTime() < new Date().getTime()) {
            statuses = ['overdue', 'done']
            inputContainer.classList.remove('hidden')
            outputContainer.classList.remove('hidden')
        }
        else if (currentEditedActivity.projectData.status == 'active') {
            statuses = ['active', 'done']
            inputContainer.classList.remove('hidden')
            outputContainer.classList.remove('hidden')
        }
        else if (currentEditedActivity.projectData.status == 'reactivated') {
            statuses = ['reactivated', 'done']
            inputContainer.classList.remove('hidden')
            outputContainer.classList.remove('hidden')
        }
        else if (currentEditedActivity.projectData.status == 'done') {
            statuses = ['done', 'reactivated'] //TODO: reactivated only if you are the project manager
            inputContainer.classList.add('hidden')
            outputContainer.classList.add('hidden')
        }
            
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
        opt.value = null
        opt.textContent = 'Select previous activity';
        selectElement.appendChild(opt);
        activitiesSamePhase.forEach((activity) => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify(activity);
            opt.textContent = activity.title;
            selectElement.appendChild(opt);
        });
        // set current edited activity's previous activity
        selectElement.value = JSON.stringify(activitiesSamePhase.find(activity => currentEditedActivity.projectData.previous == activity._id))
        
        const deleteButton = document.getElementById("editActivityDelete");
        const newDeleteButton = deleteButton.cloneNode(true);
        deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);
        newDeleteButton.addEventListener('click', async () => {
            await window.deleteActivity(currentEditedActivity._id)
            updateProjectActivities()
            closeEditActivityModal()
        })

        // hide contracts/translates checkbox if user is no project manager
        if (currentProject.owner != state._id) {
            document.getElementById('activityToEditContractsDiv').classList.add('hidden')
        }

        modal.open()
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

async function updateSettingsPage() {
    document.getElementById('settingsProjectName').innerHTML = currentProject.name
    document.getElementById('settingsProjectDescription').innerHTML = currentProject.description
    document.getElementById('settingsProjectStart').innerHTML = new Date(currentProject.start).toLocaleDateString("it-IT", infoDateFormat)
    document.getElementById('settingsProjectEnd').innerHTML = new Date(currentProject.end).toLocaleDateString("it-IT", infoDateFormat)
    // setting owner
    const response = await window.getUsers([currentProject.owner])
    const owner = response[0]
    document.getElementById('settingsProjectOwner').innerHTML = owner.username
    // setting users
    const users = await window.getUsers(currentProject.members)
    document.getElementById('settingsProjectUsers').innerHTML = users.map(u => u.username).join(", ")
}

document.getElementById('leaveProjectButton').addEventListener('click', async () => {
    // is owner of project
    if (currentProject.owner == state._id) {
        if (currentProject.members.length == 1) {
            // delete current project and go back to home
            await window.deleteProject(currentProject._id)
        }
        else if (currentProject.members.length > 1) {
            // assign random member to be the owner
            const newProject = structuredClone(currentProject)
            newProject.members = newProject.members.filter(m => m != state._id)
            const newOwner = newProject.members[Math.floor(Math.random() * newProject.members.length)] // random member
            newProject.owner = newOwner
            await window.editProject(newProject._id, newProject)
            currentProject = newProject
            updateSettingsPage()
        }
    }
    else {  // not the owner
        // cancella utente dai membri del progetto e da ogni activity del progetto di cui fa parte
        const newProject = structuredClone(currentProject)
        newProject.members = newProject.members.filter(m => m != state._id)
        await window.editProject(newProject._id, newProject)
        for (const activity of newProject.activities) {
            if (activity.users.includes(state._id)) {
                const newActivity = structuredClone(activity)
                newActivity.users = newActivity.users.filter(u => u != state._id)
                await window.editActivity(newActivity._id, newActivity)
            }
        }
        currentProject = newProject
        // cancella dalle activity del progetto di cui fa parte
        updateSettingsPage()
    }

    updateProjects()
    goToHomeView()
})


function goToSettingsPage() {
    settingsPage.classList.remove("hidden")
    overviewPage.classList.add("hidden")
    ganttPage.classList.add("hidden")
    // highlight overview title
    settingsTitle.classList.add("border-b-4", "border-secondary")
    overviewTitle.classList.remove("border-b-4", "border-secondary")
    ganttTitle.classList.remove("border-b-4", "border-secondary")
    if (currentProject.owner != state._id) {
        document.getElementById('deleteProjectButton').classList.add('hidden')
    }
    else {
        document.getElementById('deleteProjectButton').classList.remove('hidden')
    }
    updateSettingsPage()
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
            const selectedUsersIds = newProjectIds
            const newProjectName = document.getElementById("newProjectName").value
            const newProjectDescription = document.getElementById("newProjectDescription").value
            // create project
            await createProject(newProjectName, newProjectDescription, 
                newProjectStartDate, newProjectEndDate, state._id, selectedUsersIds, [])
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
        document.getElementById('createProjectError').innerHTML = ''
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
    if (exists) {
        newProjectUsers.push(userToAddInput.value)
        newProjectIds.push(user_id)
        userToAddInput.value = ''
        document.getElementById("createProjectError").innerHTML = ""
        updateNewProjectUsersInput()
    }
    else {
        document.getElementById("createProjectError").innerHTML = "User doesn't exist"
    }
}

function updateNewProjectUsersInput() {
    const addedUsernamesInput = document.getElementById("newProjectAddedUsernamesInput")
    addedUsernamesInput.value = newProjectUsers.join(', ')
}

function clearNewProjectUsers() {
    newProjectUsers.length = 0
    updateNewProjectUsersInput()
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
        opt.value = null
        opt.textContent = 'Select previous activity';
        selectElement.appendChild(opt);
        activities.forEach((activity) => {
            const opt = document.createElement('option');
            opt.value = JSON.stringify(activity);
            opt.textContent = activity.title;
            selectElement.appendChild(opt);
        });
        // hide contracts/translates checkbox if user is no project manager
        if (currentProject.owner != state._id) {
            document.getElementById('activityToAddContractsDiv').classList.add('hidden')
        }
    }
}

document.getElementById('previousActivitySelectAdd').addEventListener('change', function(event) {
    const select = event.target;
    if (select.value != 'null')
        document.getElementById('activityToAddInputContainer').classList.add('hidden');
    else
        document.getElementById('activityToAddInputContainer').classList.remove('hidden');
})

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
    let previousActivitySelectValue = null
    if (previousActivitySelect.value)
        previousActivitySelectValue = JSON.parse(previousActivitySelect.value)
    // checks
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
    else if (previousActivitySelectValue && previousActivitySelectValue!= 'Select previous activity' && 
            previousActivitySelectValue.projectData.phase !== activityToAddPhase.value) {
        activityToAddError.innerHTML = "Synced activities must have the same phase"
    }
    else if (previousActivitySelectValue && previousActivitySelectValue!= 'Select previous activity' && 
            new Date(previousActivitySelectValue.deadline).getTime() > activityToAddStartValue.getTime()) {
        activityToAddError.innerHTML = "New activity must start after previous activity's deadline"
    }
    else {
        const activityUsers = newActivityIds.concat(state._id)
        //TODO: set correct status based on previous activity (if previous activity is done it means
        //it has output, hence the new activity can be activable, else it must be waitingActivable)
        //TODO: make creation of set of activities possible
        let actInput = '';
        if (previousActivitySelectValue && previousActivitySelectValue.isDone)
            actInput = previousActivitySelectValue.projectData.output
        let actStatus = 'activable';
        if (previousActivitySelectValue && !previousActivitySelectValue.isDone)
            actStatus = 'waitingActivable';
        const projectData = {
            startDate: activityToAddStartValue,
            projectId: currentProject._id,
            isMilestone: activityToAddIsMilestone.checked,
            phase: activityToAddPhase.value,
            status: actStatus,
            contracts: activityToAddContracts.checked,
            previous: previousActivitySelectValue? previousActivitySelectValue._id : null,
            input: actInput,
            output: ''
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
        document.getElementById("activityToAddError").innerHTML = ''
        updateNewActivityUsersInput()
    }
    else {
        document.getElementById("activityToAddError").innerHTML = "User doesn't exist"
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

function getActivitiesByPhase(activities, phase, currentActivityId) {
    // Filtra le attività per la fase specificata
    let activitiesForPhase = activities.filter(activity => activity.projectData.phase === phase);

    // Ordina le attività per data di inizio
    activitiesForPhase.sort((a, b) => new Date(a.projectData.startDate) - new Date(b.projectData.startDate));
    
    // Trova l'indice dell'attività corrente
    const currentIndex = activitiesForPhase.findIndex(activity => activity.projectData._id === currentActivityId);
    
    if(activitiesForPhase.length === 1){
        return "Unique";
    }
    // Restituisci l'attività successiva se esiste, altrimenti null
    if (currentIndex !== -1 && currentIndex < activitiesForPhase.length - 1) {
        return activitiesForPhase[currentIndex + 1];
    } else {
        return "No successor";
    }
}

function getActivitiesNumberByPhase(activities, phase) {
    let activitiesForPhase = activities.filter(activity => activity.projectData.phase === phase);
    return activitiesForPhase.length;
}

function getActivitiesPhase(activities, phase){
    let activitiesForPhase = activities.filter(activity => activity.projectData.phase === phase);
    return activitiesForPhase.sort((a, b) => new Date(a.projectData.startDate) - new Date(b.projectData.startDate));
}

function calculateNewDateBasedOnDifference(date1, date2, dataNow) {
    const date1Time = new Date(date1).getTime();
    const date2Time = new Date(date2).getTime();
    const dataNowTime = new Date(dataNow).getTime();

    // Calcola la differenza in millisecondi
    const differenceInMilliseconds = Math.abs(date1Time - date2Time);

    // Aggiungi la differenza in millisecondi alla data attuale
    const newDate = new Date(dataNowTime + differenceInMilliseconds);

    return newDate.toISOString();
}

function isActivityInRitardo(activity, nowDate) {
    return new Date(activity.deadline) < new Date(nowDate);
}

const nowDate = "2025-02-23T11:00:00.000+00:00";
async function calcoloRitardo(currentActivity, countRic){
    console.log(currentActivity[countRic].deadline, currentActivity[countRic].title)
    if(getActivitiesNumberByPhase(currentActivity, currentActivity[countRic].projectData.phase) === 1){
        if(currentActivity[countRic].projectData.isMilestone === true && currentActivity[countRic].deadline < nowDate){
            console.log("UNA SOLA ATTIVITA NELLA FASE + MILESTONE")
        }else{
            updateActivityDeadline(currentActivity[countRic].projectData._id, nowDate)
            console.log("UNA SOLA ATTIVITA NELLA FASE + NON MILESTONE")
        
        }
    }else{
        if(currentActivity[countRic].projectData.isMilestone === true){
            await updateActivityStartDate(currentActivity[countRic].projectData._id,
                calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].projectData.startDate))
            currentActivity[countRic].projectData.startDate = calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].projectData.startDate)
                console.log("MILESTONE")
        }else if(getActivitiesByPhase(currentActivity, currentActivity[countRic].projectData.phase, 
            currentActivity[countRic].projectData._id) === "No successor"){
                await updateActivityDeadline(currentActivity[countRic].projectData._id,
                    calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].deadline))
                currentActivity[countRic].deadline = calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].deadline)
                await updateActivityStartDate(currentActivity[countRic].projectData._id,
                    calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].projectData.startDate))
                currentActivity[countRic].projectData.startDate = calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].projectData.startDate)
            console.log("NON MILESTONE + NO SUCCESSOR")
        }else{
            if(countRic !== 0){
                await updateActivityDeadline(currentActivity[countRic].projectData._id,
                    calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].deadline))
                currentActivity[countRic].deadline = calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].deadline)
                await updateActivityStartDate(currentActivity[countRic].projectData._id,
                    calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].projectData.startDate))
                currentActivity[countRic].projectData.startDate = calculateNewDateBasedOnDifference(currentActivity[countRic-1].deadline, currentActivity[countRic].projectData.startDate, currentActivity[countRic].projectData.startDate)
                console.log("NON MILESTONE + SUCCESSOR")
            }else{
                await updateActivityDeadline(currentActivity[countRic].projectData._id, nowDate)
                currentActivity[countRic].deadline = nowDate
                console.log("primo elemento")
            }
            countRic++
            console.log("NON MILESTONE")
            calcoloRitardo(currentActivity, countRic) 
            
        }
    }
        
    }

let newDeadline = [];
let countRic = 0
async function ritardCalc(projectId, projectStart){
    const project = await window.getActivitiesByProject(projectId);
    //const nowDate = new Date();
    let isNormal = false
    let count = 2;
    let isoDelay = "";
    let lastActivity = false;
    const processedPhases = new Set();
    project.slice().forEach((activity, index) => {
        const phase = activity.projectData.phase;

        // Verifica se la fase corrente è già stata elaborata
        if (!processedPhases.has(phase)) {
            // Aggiungi la fase al set delle fasi elaborate
            processedPhases.add(phase);

            // Chiama calcoloRitardo per la fase corrente
            if (isActivityInRitardo(activity, nowDate)) {
                calcoloRitardo(getActivitiesPhase(project, phase), countRic);
            }
        }
    });

}

function isDateInArray(dateToCompare, datesArray) {
    // Estrai anno, mese e giorno dalla data da confrontare
    const compareDate = new Date(dateToCompare);
    const yearToCompare = compareDate.getUTCFullYear();
    const monthToCompare = compareDate.getUTCMonth(); // Il mese è zero-indicizzato (0 = gennaio, 11 = dicembre)
    const dayToCompare = compareDate.getUTCDate();
    const hourToCompare = compareDate.getUTCHours();

    // Confronta con ciascun elemento dell'array
    for (let date of datesArray) {
        const currentDate = new Date(date);
        const year = currentDate.getUTCFullYear();
        const month = currentDate.getUTCMonth();
        const day = currentDate.getUTCDate();

        // Se anno, mese e giorno sono uguali, restituisci true
        if (yearToCompare === year && monthToCompare === month && dayToCompare === day && hourToCompare === currentDate.getUTCHours()) {
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
        const hourA = dateA.getUTCHours();
        
        const yearB = dateB.getUTCFullYear();
        const monthB = dateB.getUTCMonth();
        const dayB = dateB.getUTCDate();
        const hourB = dateB.getUTCHours();
        
        // Confronta anno
        if (yearA !== yearB) {
            return yearA - yearB;
        }
        
        // Se l'anno è uguale, confronta mese
        if (monthA !== monthB) {
            return monthA - monthB;
        }

        if (dayA !== dayB) {
            return dayA - dayB;
        }
        
        // Se mese e anno e giorno sono uguali, confronta ora
        return hourA - hourB;
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
       <div class="bg-secondary text-white text-center truncate"><span>In charge</span></div>
       <div class="bg-secondary text-white text-center truncate"><span>Start</span></div>
       <div class="bg-secondary text-white text-center truncate"><span>End</span></div>
    
    `;

    containerFixedGrid.appendChild(navTitle);

   
    const dates = [];
    const sortedDates = [];
    const uniqueDays = new Set();
    let uniqueDay = 0
    let countx = 1;
    let county = 2;

    project.slice().reverse().forEach((activity, index) => {
        let start
        let pStart 
        let activityStructure = {
            start:"",
            end:"",
            phase:"",
            previous:"",
            id:"",
            title:"",
            owner:""
        }
            
            const startDate = new Date(activity.projectData.startDate);
            if(!isNaN(startDate)){
            start = startDate.setHours(startDate.getHours() + 1);
            start = new Date(start).toISOString();
            pStart = new Date(activity.deadline);
            pStart.setHours(pStart.getHours() + 1);
            pStart = new Date(pStart).toISOString()
            activityStructure.start = start;
            activityStructure.phase = activity.projectData.phase;
            activityStructure.end = pStart;
            activityStructure.previous = activity.projectData.previous;
            activityStructure.id = activity._id;
            activityStructure.title = activity.title;
            activityStructure.owner = activity.users;
            dates.push(activityStructure) 
            
        }    
        
        dates.sort((a, b) => {
            // Ordina per fase in ordine crescente
            const phaseComparison = a.phase.localeCompare(b.phase);
            if (phaseComparison !== 0) {
                return phaseComparison;
            }
        
            // Se le fasi sono uguali, ordina per sequenza
            if (a.previous === null && b.previous !== null) {
                return -1;
            }
            if (a.previous !== null && b.previous === null) {
                return 1;
            }
            if (a.previous === b.id) {
                return 1;
            }
            if (b.previous === a.id) {
                return -1;
            }
        
            // Se anche la sequenza è uguale, ordina per data (start) in ordine crescente
            return new Date(a.start) - new Date(b.start);
        });
    })
    
        // Costruisci le sequenze basate su previous
        const dateMap = new Map();
        dates.forEach(date => dateMap.set(date.id, date));
        

        dates.forEach(date => {
            
            if (date.previous === null ) {
                sortedDates.push(date);
            
                let currentId = date.id;
                while (true) {
                    
                    const nextDate = dates.find(d => d.previous === currentId);
                    if (!nextDate) break;
                    
                    sortedDates.push(nextDate);
                    currentId = nextDate.id;
                }
            }    
            
        });
        
    async function getUserNames(userIds) {
        const users = await window.getUsers(userIds);
        return users.map(user => user.username).join(", "); 
    }
    
    
        
    for (const [index, activity] of project.entries()) {
    
        const userNames = await getUserNames(sortedDates[index].owner);
            

        const taskGrid = document.createElement("div");
        taskGrid.classList.add("bg-white", "text-secondary", "font-bold", "grid", "grid-cols-4", "divide-x", "divide-y", "divide-secondary");
        taskGrid.innerHTML = ` 
            <div class="truncate text-center flex items-center justify-center"><span>${sortedDates[index].title}</span><span class="text-xs text-gray-400">[${sortedDates[index].phase}]</span></div>
            <div class="truncate text-center"><span>${userNames}</span></div>
            <div class="truncate text-center"><span>${formatDateToDayMonth(sortedDates[index].start)}</span></div>
            <div class="truncate text-center"><span>${formatDateToDayMonth(sortedDates[index].end)}</span></div>

        `;
        containerFixedGrid.appendChild(taskGrid);
        
        
    };


    const dayGrid = document.createElement("div");
    dayGrid.classList.add("relative", "w-1/2", "bg-white", "text-white", "font-bold", "grid", "grid-flow-col", "overflow-auto", "overflow-y-hidden", "pb-4", "-mb-4");

    
        project.slice().forEach((activity, index) => {
            

            dates.forEach(date => {
            const day = new Date(date.start).toISOString().split('T')[0]; 
            uniqueDays.add(day);
            const endDay = new Date(date.end).toISOString().split('T')[0]; 
            uniqueDays.add(endDay);
            });

            uniqueDay = uniqueDays.size;
            

                        
        if(index === project.length-1){
            const colorGrid = document.createElement("div");
            colorGrid.classList.add("absolute", "left-0", "top-6", "right-0", "bg-white", "grid", "divide-y", "divide-x", "divide-secondary");
            colorGrid.style.gridTemplateColumns =  `repeat(${uniqueDay}, minmax(96px, 1fr))`;
            colorGrid.style.gridTemplateRows =  `repeat(${project.length}, minmax(0, 1fr))`;
            
            

            let actualyStart =  sortedDates.length > 0 ? sortedDates[0].start : null; //first start of dates
            let actualyEnd = dates.length > 0 ? dates[0].end : null; //first end of dates
            let oldStart = "";
            let oldEnd = "";
            let stato = "";
            let hours = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
            let inActivityTime = false;
            const uniqueDaysArray = Array.from(uniqueDays).map(day => new Date(day).toISOString());
            uniqueDaysArray.sort((a, b) => new Date(a) - new Date(b));
            const colors = ["bg-red-200","bg-orange-200","bg-amber-200","bg-yellow-200","bg-lime-200","bg-green-200",
                            "bg-emerald-200","bg-teal-200","bg-cyan-200","bg-sky-200","bg-blue-200","bg-indigo-200",
                            "bg-violet-200","bg-purple-200","bg-fuchsia-200","bg-pink-200","bg-rose-200"];
            let currentColorIndex = -1;
            let lastPhase = null;
            

            project.slice().reverse().forEach((activity, index) => {
                const sortDates = sortByDate(dates);
                if (sortDates[index].phase !== lastPhase) {
                    lastPhase = sortDates[index].phase;
                    currentColorIndex = (currentColorIndex + 1) % colors.length; // Cambia colore ciclicamente
                }
                
            
                uniqueDaysArray.forEach((d => {
                    let classe = "";
                    let hourStart = extractTimeFromDate(actualyStart) -1
                    let hourEnd = extractTimeFromDate(actualyEnd) -1 
                    const colorDiv = document.createElement("div");
                    colorDiv.classList.add("truncate", "text-center", "grid", "grid-cols-24");
                    

                hours.forEach((hour) => {
                                
                if(((formatDateToDayMonth(actualyStart) === formatDateToDayMonth(d) && hourStart === hour)|| 
                    (formatDateToDayMonth(actualyEnd) === formatDateToDayMonth(d) && hourEnd === hour))){

                   
                    if(inActivityTime === false){
                        inActivityTime = true;
                        stato = "colorato"
                        classe = colors[currentColorIndex];   
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
                        classe = colors[currentColorIndex];
                        
                    }   
                }
                
                
        
                const hourDiv = document.createElement("div");
                hourDiv.classList.add("truncate", "text-center", classe);

                hourDiv.innerHTML = `<div>&nbsp;</div>`
                colorDiv.appendChild(hourDiv);
            });
            
            colorGrid.appendChild(colorDiv);
                
            }))
            
            if(index+1 < project.length){
            actualyStart = sortedDates[index+1].start
            actualyEnd = sortedDates[index+1].end
            }  
            
            
            inActivityTime = false;
            county++
        })
        dayGrid.appendChild(colorGrid)
        }
    });
//si può togliere
    const uniqueDaysArray = Array.from(uniqueDays).map(day => new Date(day).toISOString());
    uniqueDaysArray.sort((a, b) => new Date(a) - new Date(b));

    for (let i = 0; i < uniqueDay; i++) {
        const dayDiv = document.createElement("div");
            dayDiv.innerHTML = `
            <div class="truncate text-center min-w-24 bg-secondary"><span>${formatDateToDayMonth(uniqueDaysArray[i])}</span></div>
            `;
            dayGrid.appendChild(dayDiv);
    }
        ganttContainer.appendChild(dayGrid);
}

