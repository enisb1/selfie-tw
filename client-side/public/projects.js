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
let currentProject = null;
let currentEditedActivity = null;
let activityNumber = 0

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
        // Add content to the div
        activityDiv.innerHTML = `
            <!-- title -->
            <div class="w-3/12 truncate">
                <span>${activity.title}</span>
            </div>
            <!-- users -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${users.map(u => u.username).join(", ")}</span>
            </div>
            <!-- deadline -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)}</span>
            </div>
            <!-- milestone or not-->
            <div class="w-2/12 border-l border-secondary truncate">
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
        // Add content to the div
        activityDiv.innerHTML = `
            <!-- title -->
            <div class="w-3/12 truncate">
                <span>${activity.title}</span>
            </div>
            <!-- users -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${users.map(u => u.username).join(", ")}</span>
            </div>
            <!-- deadline -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)}</span>
            </div>
            <!-- milestone or not-->
            <div class="w-2/12 border-l border-secondary truncate">
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
        // Add content to the div
        activityDiv.innerHTML = `
            <!-- title -->
            <div class="w-3/12 truncate">
                <span>${activity.title}</span>
            </div>
            <!-- users -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${users.map(u => u.username).join(", ")}</span>
            </div>
            <!-- deadline -->
            <div class="w-2/12 border-l border-secondary truncate">
                <span class="ml-1">${new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)}</span>
            </div>
            <!-- milestone or not-->
            <div class="w-2/12 border-l border-secondary truncate">
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
        document.getElementById('infoActivityDeadline').innerHTML = new Date(activity.deadline).toLocaleDateString("it-IT", infoDateFormat)
        const users = await window.getUsers(activity.users)
        document.getElementById('infoActivityUsers').innerHTML = users.map(u => u.username).join(", ")
        document.getElementById('infoActivityMilestone').innerHTML = activity.projectData.isMilestone? 'yes' : 'no'
        document.getElementById('infoActivityContracts').innerHTML = activity.projectData.contracts? 'yes' : 'no'
        modal.open()
    }
}

async function addUserToEditedActivityList() {
    const userToAddInput = document.getElementById("editActivityUsersInput")
    let exists = false
    let user_id = ''
    const activityToEditError = document.getElementById("activityToEditError")
    console.log(userToAddInput.value)
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
        console.log('prova')
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
const listOfSubactivities = [];
let nSubactivities = 0;

function resetAddSubactivityElements() {
    document.getElementById("activityToAddTitleParagraph").innerHTML = 'Title'
    document.getElementById("activityToAddDeadlineParagraph").innerHTML = 'Deadline'
    document.getElementById("activityToAddUsersParagraph").innerHTML = 'Invite users'
    document.getElementById("addSubactivityButtonDiv").classList.add("hidden")
    document.getElementById("addSubactivityButtonDiv").classList.remove("block")
    document.getElementById("compositeActivityToAddTitleDiv").classList.add("hidden")
    document.getElementById("subactivitiesSummary").classList.remove("mt-4")
}

function updateSubactivityElements() {
    document.getElementById("activityToAddTitleParagraph").innerHTML = `Subactivity ${nSubactivities+1} title`
    document.getElementById("activityToAddDeadlineParagraph").innerHTML = `Subactivity ${nSubactivities+1} deadline`
    document.getElementById("addSubactivityButtonDiv").classList.add("block")
    document.getElementById("addSubactivityButtonDiv").classList.remove("hidden")
    document.getElementById("compositeActivityToAddTitleDiv").classList.remove("hidden")
}

function showAddActivityModal() {
    const modal = document.getElementById('addActivityModal');
    if (modal) {
        modal.open()
        newActivityUsers.length = 0
        listOfSubactivities.length = 0
        nSubactivities = 0
        document.getElementById('addActivityForm').reset();
        document.getElementById('activityToAddError').innerHTML = ''
        document.getElementById('subactivitiesSummary').innerHTML = ''
        resetAddSubactivityElements()
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

document.getElementById("activityToAddIsComposite").addEventListener('click', (event) => {
    // Handle the click event
    if (event.target.checked) {
        updateSubactivityElements()
        document.getElementById("activityToAddTitle").removeAttribute("required")
        document.getElementById("activityToAddDeadline").removeAttribute("required")
        document.getElementById("compositeActivityToAddTitleInput").setAttribute("required", "true")
    } else {
        resetAddSubactivityElements()
        document.getElementById("activityToAddTitle").setAttribute("required", "true")
        document.getElementById("activityToAddDeadline").setAttribute("required", "true")
        document.getElementById("compositeActivityToAddTitleInput").removeAttribute("required")
    }
})

document.getElementById("addSubactivityButton").addEventListener('click', (event) => {
    const activityToAddTitle = document.getElementById('activityToAddTitle');
    const activityToAddDeadline = document.getElementById('activityToAddDeadline');
    const activityToAddError = document.getElementById('activityToAddError');
    const subactivitiesSummary = document.getElementById('subactivitiesSummary');

    if (activityToAddTitle.value === '')
        activityToAddError.innerHTML = 'Subactivity\'s title is needed'
    else if (activityToAddDeadline.value === '')
        activityToAddError.innerHTML = 'Subactivity\'s deadline is needed'
    else if (new Date(activityToAddDeadline.value).getTime() <= new Date(currentProject.start).getTime()
        || new Date(activityToAddDeadline.value).getTime() >= new Date(currentProject.end).getTime()) {
        activityToAddError.innerHTML = "Deadline must be between project start and end date"
    }
    else {
        const subactivityDiv = document.createElement('div');
        subactivityDiv.classList.add("mt-2", "rounded");
        subactivityDiv.innerHTML = `
            <p><strong>Title:</strong> ${activityToAddTitle.value}</p>
            <p><strong>Deadline:</strong> ${new Date(activityToAddDeadline.value).toLocaleDateString("it-IT", infoDateFormat)}</p>
        `;
        subactivitiesSummary.appendChild(subactivityDiv);
        listOfSubactivities.push({"title": activityToAddTitle.value, 
            "deadline": new Date(activityToAddDeadline.value)})
        // update values
        activityToAddTitle.value = ''
        activityToAddDeadline.value = ''
        nSubactivities++;
        updateSubactivityElements()
    }
})

// add activity form submit
document.getElementById('addActivityForm').addEventListener('submit', async function(event) {
    // prevent default refresh
    event.preventDefault();

    // add activity
    const activityToAddTitle = document.getElementById("activityToAddTitle")
    const activityToAddIsMilestone = document.getElementById("activityToAddIsMilestone")
    const activityToAddContracts = document.getElementById("activityToAddContracts")
    const activityToAddError = document.getElementById("activityToAddError")
    const projectStart = new Date(currentProject.start)
    const projectEnd = new Date(currentProject.end)
    const activityToAddDeadlineValue = new Date(activityToAddDeadlineElem.value)
    if (!document.getElementById("activityToAddIsComposite").checked) {
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
    }
    else {
        //TODO: check if activities > 0, if so add composite activity
        if (listOfSubactivities.length > 0) {
            const subactivitiesIds = []
            for (const subactivity of listOfSubactivities) {
                const createdSubactivity = await window.postActivity(subactivity.title, subactivity.deadline, 
                    newActivityIds.concat(state._id), null)
                subactivitiesIds.push(createdSubactivity._id)
            }
            // create composite activity to add to project
            const projectData = {
                projectId: currentProject._id,
                isMilestone: activityToAddIsMilestone.checked,
                subActivities: subactivitiesIds,
                status: 'activable',
                contracts: activityToAddContracts.checked
            }
            const createdCompositeActivity = await window.postActivity(document.getElementById
                ("compositeActivityToAddTitleInput").value, null, 
                newActivityIds.concat(state._id), projectData)
            await window.addActivityToProject(currentProject._id, createdCompositeActivity._id)
            activityToAddError.innerHTML = ""
            closeAddActivityModal()
            updateProjectActivities()
        }
        else {
            activityToAddError.innerHTML = "No subactivities have been added"
        }
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