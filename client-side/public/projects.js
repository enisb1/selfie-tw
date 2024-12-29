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
const settingsPage = document.getElementById('settingsPage');
const settingsTitle = document.getElementById('settingsTitle');
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
    console.log(activities)
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
function goToSettingsPage() {
    settingsPage.classList.remove("hidden")
    overviewPage.classList.add("hidden")
    listPage.classList.add("hidden")
    ganttPage.classList.add("hidden")
    // highlight overview title
    settingsTitle.classList.add("border-b-4", "border-secondary")
    overviewTitle.classList.remove("border-b-4", "border-secondary")
    listTitle.classList.remove("border-b-4", "border-secondary")
    ganttTitle.classList.remove("border-b-4", "border-secondary")
}


function goToOverviewPage() {
    overviewPage.classList.remove("hidden")
    settingsPage.classList.add("hidden")
    listPage.classList.add("hidden")
    ganttPage.classList.add("hidden")
    // highlight overview title
    settingsTitle.classList.remove("border-b-4", "border-secondary")
    overviewTitle.classList.add("border-b-4", "border-secondary")
    listTitle.classList.remove("border-b-4", "border-secondary")
    ganttTitle.classList.remove("border-b-4", "border-secondary")
}

function goToListPage() {
    overviewPage.classList.add("hidden")
    settingsPage.classList.add("hidden")
    listPage.classList.remove("hidden")
    ganttPage.classList.add("hidden")
    // highlight list title
    settingsTitle.classList.remove("border-b-4", "border-secondary")
    overviewTitle.classList.remove("border-b-4", "border-secondary")
    listTitle.classList.add("border-b-4", "border-secondary")
    ganttTitle.classList.remove("border-b-4", "border-secondary")
}

function goToGanttPage() {
    overviewPage.classList.add("hidden")
    settingsPage.classList.add("hidden")
    listPage.classList.add("hidden")
    ganttPage.classList.remove("hidden")
    // highlight gantt title
    settingsTitle.classList.remove("border-b-4", "border-secondary")
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
            ritardCalc(project._id, project.start)
            createGrid(project._id, project.start)
            createSettingsPage(project._id, project.name, project.start, project.description)
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


    

  
    
    


