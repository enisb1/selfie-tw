<template>
    <!--Blur effect-->
    <div class="h-14 fixed bottom-0 left-0 right-0 backdrop-blur-xl
                    lg:hidden"></div>

    <!--NavBar-->
    <div class="grid grid-flow-col auto-cols-auto bg-secondary rounded-3xl fixed bottom-8 left-1/2 -translate-x-1/2 w-10/12 shadow-xl max-w-lg
                lg:bottom-auto lg:top-20 lg:translate-x-0 lg:left-4 lg:absolute">
        <button id="button_note_page"
            :class="{ 'text-secondary bg-white rounded-3xl ': inNotePage, 'text-white': !inNotePage }" @click="showNotes"
            class="p-2 font-bold flex justify-center items-center">Note</button>
        <button id="button_all_page" :class="{ 'text-secondary bg-white rounded-3xl': inAllPage, 'text-white': !inAllPage }"
            @click="showAll" class="p-2 font-bold">All</button>
        <button id="button_task_page"
            :class="{ 'text-secondary bg-white rounded-3xl': inTaskPage, 'text-white': !inTaskPage }" @click="showTasks"
            class="p-2 font-bold">Task</button>
    </div>

    <!--Add button-->
    <button @click="toggleAddMenu" class="bg-white h-11 w-11 fixed bottom-20 right-4 rounded-full border-2 border-third
                                    lg:bottom-auto lg:top-20 lg:absolute">
        <img class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/add.png" alt="Add">
    </button>

    <!--Filter button-->
    <button @click="toggleFilterModal" class="bg-white h-11 w-11 right-4 fixed bottom-20 rounded-full border-2 border-third invisible
                                    lg:visible lg:bottom-auto lg:top-20 lg:right-20 lg:absolute">
        <img class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/filterBlack.png"
            alt="Filter">
    </button>

    <!--Add menu-->
    <div v-show="showAddMenu" @click.self="closeAddMenu" class="fixed top-0 left-0 h-full w-full">
        <div v-show="showAddMenu" class="fixed right-2 bottom-32 z-2 w-48
                                    lg:bottom-auto lg:top-32">
            <div class="bg-white p-2 grid grid-cols-1 rounded-xl border border-third shadow-xl divide-y">
                <button @click="toggleAddModal" v-if="notesVisible && !tasksVisible"
                    class="p-2 text-third font-bold flex justify-between items-center">
                    Add Note
                    <img class="w-4" src="../images/noteBlack.png" alt="add_nota">
                </button>
                <button @click="toggleAddModal" v-if="tasksVisible && !notesVisible"
                    class="p-2 text-third font-bold flex justify-between items-center">
                    Add Task
                    <img class="w-4" src="../images/taskBlue.png" alt="add_nota">
                </button>
                <button @click="toggleAddModal" v-if="notesVisible && tasksVisible"
                    class="p-2 text-third font-bold flex justify-between items-center">
                    Add Note/Task
                    <img class="w-4" src="../images/allBlue.png" alt="add_nota">
                </button>
                <button @click="toggleFilterModal" class="p-2 text-third font-bold flex justify-between items-center
                                                lg:hidden">
                    Add Filter
                    <img class="w-4" src="../images/filterBlack.png" alt="add_filter">
                </button>
            </div>
        </div>
    </div>

    <!--AddNoteTask modal-->
    <div v-show="showAddModal" @click.self="closeAddMenu" class="fixed top-0 left-0 bg-black/40 h-full w-full">
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2 max-w-xs w-full border-4 border-third">
            <div class="border border-third fixed top-[52px] left-0 w-full"></div>
            <div class="content bg-white p-2">
                <header class=" flex justify-between items-center">
                    <button :class="{ 'bg-third text-white': inNoteAdd, 'text-third': !inNoteAdd }" v-show="notesVisible"
                        @click="changeN" class="p-2 px-3 font-bold rounded-xl">Add Note</button>
                    <button :class="{ 'bg-third text-white': inTaskAdd, 'text-third': !inTaskAdd }" v-show="tasksVisible"
                        @click="changeT" class="p-2 px-3 mr-10 font-bold rounded-xl">Add Task</button>
                    <button @click="toggleAddModal"><img class="w-4 h-4 mr-2 hover:border-2 border-third"
                            src="../images/x.png" alt="Croce"></button>
                </header>
                <form @submit="handleSubmit">
                    <div class="row title p-2  grid grid-row-2">
                        <label class="font-semibold py-1">Title</label>
                        <div class="w-full max-w-sm min-w-[200px]">
                            <input class="w-full bg-transparent placeholder:text-slate-400 text-secondary text-sm 
                                          border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease 
                                          focus:outline-none focus:border-secondary hover:border-secondary shadow-sm 
                                          focus:shadow" placeholder="Type here..." v-model="noteTitle" />
                        </div>
                    </div>

                    <div class="row title p-2  grid grid-row-2">
                        <label class="font-semibold py-1">Category</label>
                        <div class="w-full max-w-sm min-w-[200px]">
                            <input class="w-full bg-transparent placeholder:text-slate-400 text-secondary text-sm 
                                          border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease 
                                          focus:outline-none focus:border-secondary hover:border-secondary shadow-sm 
                                          focus:shadow" placeholder="Type here..." v-model="noteCategory" />
                        </div>
                    </div>

                    <div v-if="!inTaskAdd && !inTaskPage" class="p-2">
                        <div class="font-semibold py-1">Format</div>
                        <div class="inline-flex items-center">
                            <label class="flex items-center cursor-pointer relative">
                                <input defaultChecked type="radio" value="normalNote" class="peer h-5 w-5 cursor-pointer transition-all 
                                       appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border 
                                       border-slate-300 checked:bg-secondary checked:border-secondary" 
                                       id="check-custom-style" v-model="noteFormat" />
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 
                                             transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" 
                                     fill="currentColor" stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 
                                          0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                          clip-rule="evenodd"></path>
                                </svg>
                                </span>
                            </label>
                            <div class="ml-2">Note</div>   
                        </div>
                        <div class="inline-flex items-center fixed right-4">
                            <label class="flex items-center cursor-pointer relative">
                                <input defaultChecked type="radio" value="markdownNote" class="peer h-5 w-5 cursor-pointer transition-all 
                                       appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border 
                                       border-slate-300 checked:bg-secondary checked:border-secondary" 
                                       id="check-custom-style" v-model="noteFormat" />
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 
                                             transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" 
                                     fill="currentColor" stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 
                                          0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                          clip-rule="evenodd"></path>
                                </svg>
                                </span>
                            </label>
                            <div class="ml-2">Markdown Note</div>   
                        </div>

                        
                    </div>

                    <div class="p-2"> 
                        <div class="font-semibold py-1">Access List</div>
                        <div class="inline-flex items-center">
                            <label class="flex items-center cursor-pointer relative">
                                <input defaultChecked type="radio" value="publicAccess" class="peer h-5 w-5 cursor-pointer transition-all 
                                       appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border 
                                       border-slate-300 checked:bg-secondary checked:border-secondary" 
                                       id="check-custom-style" v-model="noteSecurity" />
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 
                                             transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" 
                                     fill="currentColor" stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 
                                          0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                          clip-rule="evenodd"></path>
                                </svg>
                                </span>
                            </label>
                            <div class="ml-2">Public</div>   
                        </div>
                        <div class="inline-flex items-center fixed left-1/2 -translate-x-1/2">
                            <label class="flex items-center cursor-pointer relative">
                                <input defaultChecked type="radio" value="selectAccess" class="peer h-5 w-5 cursor-pointer transition-all 
                                       appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border 
                                       border-slate-300 checked:bg-secondary checked:border-secondary" 
                                       id="check-custom-style" v-model="noteSecurity" />
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 
                                             transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" 
                                     fill="currentColor" stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 
                                          0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                          clip-rule="evenodd"></path>
                                </svg>
                                </span>
                            </label>
                            <div class="ml-2">Select</div>   
                        </div>
                        <div class="inline-flex items-center fixed right-4">
                            <label class="flex items-center cursor-pointer relative">
                                <input defaultChecked type="radio" value="privateAccess" class="peer h-5 w-5 cursor-pointer transition-all 
                                       appearance-none rounded-full bg-slate-100 shadow hover:shadow-md border 
                                       border-slate-300 checked:bg-secondary checked:border-secondary" 
                                       id="check-custom-style" v-model="noteSecurity" />
                                <span class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 
                                             transform -translate-x-1/2 -translate-y-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" 
                                     fill="currentColor" stroke="currentColor" stroke-width="1">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 
                                          0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                          clip-rule="evenodd"></path>
                                </svg>
                                </span>
                            </label>
                            <div class="ml-2">Private</div>   
                        </div>
                    </div>

                    <div class="flex justify-center mx-12 p-4">
                        <button id="SaveButton" type="submit"
                            @click="toggleEditor" class="px-4 py-1 shadow-xl hover:bg-third hover:text-white font-semibold">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!--Filter modal-->
    <div v-show="showFilterModal" @click.self="closeAddMenu" class="fixed top-0 left-0 bg-black/40 h-full w-full">
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2 max-w-xs w-full border-4 border-third">
            <div class="border border-third fixed top-[52px] left-0 w-full"></div>
            <div class="content bg-white p-2 ">
                <header class=" flex justify-between items-center">
                    <p class="p-2 text-third font-bold">Add Filter</p>
                    <button @click="toggleFilterModal"><img class="w-4 h-4 mr-2 hover:border-2 border-third"
                            src="../images/x.png" alt="Croce"></button>
                </header>
                <form>
                    <div class="grid grid-rows-2 grid-cols-2 p-2 cursor-pointer">
                        <button type="button" :class="{ 'bg-third text-white': inDate, 'bg-fourth': !inDate }"
                            @mouseenter="inButtonDate" @mouseleave="inButtonDate" @click="changeFilterDate"
                            class="font-semibold flex flex-col items-center p-2 m-2 rounded-lg">
                            <img class="w-5" :src="inDate ? hoverImgDate : defaultImgDate"
                                alt="filtroData">
                            Date
                        </button>
                        <button type="button" :class="{ 'bg-third text-white': inTitle, 'bg-fourth': !inTitle }"
                            @mouseenter="inButtonTitle" @mouseleave="inButtonTitle" @click="changeFilterTitle"
                            class="font-semibold flex flex-col items-center p-2 m-2 rounded-lg">
                            <img class="w-5" :src="inTitle ? hoverImgTitle : defaultImgTitle" alt="filtroTitolo">
                            Title
                        </button>
                        <button type="button" :class="{ 'bg-third text-white': inLength, 'bg-fourth': !inLength }"
                            @mouseenter="inButtonLength" @mouseleave="inButtonLength" @click="changeFilterLength"
                            class="font-semibold flex flex-col items-center p-2 m-2 rounded-lg">
                            <img class="w-5" :src="inLength ? hoverImgLength : defaultImgLength" alt="filtroLunghezza">
                            Length
                        </button>
                        <button type="button" :class="{ 'bg-third text-white': inCategory, 'bg-fourth': !inCategory }"
                            @mouseenter="inButtonCategory" @mouseleave="inButtonCategory" @click="changeFilterCategory"
                            class="font-semibold flex flex-col items-center p-2 m-2 rounded-lg">
                            <img class="w-5" :src="inCategory ? hoverImgCategory : defaultImgCategory"
                                alt="filtroCategoria">
                            Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!--NoteList-->
    <div class="grid grid-cols-1 gap-8 mx-10 pb-20 py-2 lg:grid-cols-3 lg:py-24">
        <div v-for="note in toggleFilter" :key="note.id">
            <SingleNote :note="note" @delete-note="deleteNote" @duplicate-note="duplicateNote" />
        </div>
    </div>   

    <div v-if="categoryFilter" class="fixed top-0 left-0 bg-black/40 h-full w-full">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2 m-4  border-4 border-third bg-white">
            <div class="grid grid-cols-3 gap-2 p-2">
                <div class="flex justify-center" v-for="(category,index) in categories" :key="index">
                    <button class="p-2 px-4 bg-secondary rounded-2xl text-white font-semibold w-full">{{ category.title }}</button>
                </div>
            </div>
            
        </div>
    </div>
    

    <!--NoteEditor-->
    <div v-if="editorVisible" class="fixed left-0 top-0 h-full w-full">
        <div class="fixed top-0 h-full w-full bg-white">
            <div v-if="noteFormat == 'normalNote'" class="p-4 z-10">
                <button @click="toggleEditor" class="w-4"><img src="@/images/returnButton.png" alt="returnButton"></button>
                <!--<span class="fixed left-1/2 -translate-x-1/2 text-secondary text-center min-w-72"> {{ createDate(note.createdAt) }} </span>-->
                <h1 class="font-bold text-2xl mt-8 mb-6"> {{ noteTitle }} </h1>
                <textarea v-model="noteBody" rows="12" cols="50" placeholder="Write your text here..." 
                          class="w-full"></textarea>

            </div>
            <div v-else-if="noteFormat == 'markdownNote'" class="p-4 z-10">
                <button @click="toggleEditor" class="w-4"><img src="@/images/returnButton.png" alt="returnButton"></button>
                <span class="fixed left-1/2 -translate-x-1/2 text-secondary text-center min-w-72">30 October 2024 16:27</span>
                <h1 class="font-bold text-2xl mt-8 mb-6"> {{ noteTitle }} </h1>
                <textarea v-model="noteBody" rows="12" cols="50" placeholder="Write your text in markdown here..." 
                          class="w-full"></textarea>
            <div id="output" v-html="convertedOutput" class="fixed bottom-0 left-0 p-4 top-2/3 mt-4 overflow-y-scroll w-full overflow-auto whitespace-normal"></div>
            </div>

            <div v-else class="p-4 z-10">
                <button @click="toggleEditorTask" class="w-4"><img src="@/images/returnButton.png" alt="returnButton"></button>
                <span class="fixed left-1/2 -translate-x-1/2 text-secondary text-center min-w-72">30 October 2024 16:27</span>
                <div class="relative mt-3">
                    <input class="peer w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border
                                border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none 
                                focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" v-model="taskTitle">
                    <label class="absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-slate-400 text-sm transition-all 
                                  transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs 
                                  peer-focus:text-slate-400 peer-focus:scale-90">
                        Write the task to add here...
                    </label>
                </div>
                <button @click="addTask" class="p-4 w-full my-4 bg-secondary text-white rounded-xl font-bold">Add task</button>
                <h1 class="font-bold text-2xl mt-6 mb-4 text-secondary"> {{ noteTitle }} </h1>
                
                <div class="grid grid-cols-1 gap-2 py-2 lg:grid-cols-3">
                    <div v-for="task in tasks" :key="task.id">
                        <SingleTask :task="task" />
                    </div>
                </div>
                
            </div>
        </div>
    </div>

    

</template>

<script>
import { onMounted, onBeforeMount, ref, computed } from 'vue';
import defaultImgDate from "../images/filtrodata.png"
import hoverImgDate from "../images/filtrodatab.png"
import defaultImgTitle from "../images/filtrotitolo.png"
import hoverImgTitle from "../images/titleFilterWhite.png"
import defaultImgLength from "../images/filtrolunghezza.png"
import hoverImgLength from "../images/lengthFilterWhite.png"
import defaultImgCategory from "../images/filtrocategoria.png"
import hoverImgCategory from "../images/categoryFilterWhite.png"
import Modal from '@/components/Modal.vue';
import SingleNote from '@/components/Notes/SingleNote.vue';
import SingleTask from '@/components/Notes/SingleTask.vue';
import { marked } from 'marked';
import { postNote, getNotes, deleteNoteById, getNoteById, updateNoteById} from '@/apis/note'
import { postCategory, getCategory, deleteCategoryById } from '@/apis/category'



export default {
    
    components: {
        SingleNote,
        SingleTask
    },
    setup() {
        
        const notes = ref([])
        const noteTitle = ref('')
        const noteBody = ref('')
        const taskBody = ref([])
        const noteCategory = ref('')
        const noteSecurity = ref('')
        const noteFormat = ref('')
        const noteType = ref("Note")

        const categories = ref([])
        const categoryFilter = ref(false)
        
        
        //Add Note to NoteView
        const addNote = async () => {

            notes.value.push({
                title: noteTitle.value,
                bodyNote: noteBody.value,
                bodyTask: taskBody.value,
                category: noteCategory.value,
                format: noteFormat.value,
                access: noteSecurity.value,
                type: noteType.value
            })

            categories.value.push({
                title: noteCategory.value
            })

            await postCategory(noteCategory.value);

            await postNote(noteTitle.value, noteBody.value, taskBody.value, noteCategory.value, noteFormat.value, noteSecurity.value, noteType.value);
            noteTitle.value = "";  
            noteBody.value = "";
            taskBody.value = [];
            noteCategory.value = "";
            noteFormat.value = "";
            noteSecurity.value = "";
            noteType.value = ""
            
            
        };


        //Load note/task NoteView
        const loadNotes = async () => {
            try {
                const fetchNotes = await getNotes();
                notes.value = fetchNotes;
                const fetchCategory = await getCategory();
                categories.value = fetchCategory;
            } catch (error) {
                console.error("Errore durante il caricamento delle note: ", error);
            }
        };

        onMounted(() => {
            loadNotes();
            
        });

        const tasks = ref([])
        const taskTitle = ref("")
        const taskDone = ref(false)
        
        //Add Task to single TaskNote
        const addTask = () => {
            if(taskTitle.value.trim() === '' || taskTitle.value === null){
                return
            }
            tasks.value.push({
                title: taskTitle.value,
                done: taskDone.value
            })
            taskTitle.value = ""
        }

        //Add TaskNote to NoteView
        const titles = ref(null)
        const toggleEditorTask =  () => {
            titles.value = tasks.value.map(task => task.title)
            taskBody.value = titles.value
            editorVisible.value = !editorVisible.value
            showAddModal.value = false
            showAddMenu.value = false
            addNote()     
        }

         //Delete Note to NoteView
        const deleteNote = async (id,idc) => {
            try{
                const result = await deleteNoteById(id)
                console.log(result)
                notes.value = notes.value.filter(note => note._id !== id)
                /*const resultCat = await deleteCategoryById(id)
                console.log(resultCat)
                categories.value = categories.value.filter(category => category._id !== id)*/

            }catch (error){
                console.error("Errore durante il cancellamento delle note: ", error);
            }
        }

        const duplicateNote = async (id) => {
            try{
                const noteId = await getNoteById(id)
                notes.value.push({
                    title: noteId.title,
                    bodyNote: noteId.bodyNote,
                    bodyTask: noteId.bodyTask,
                    category: noteId.category,
                    format: noteId.format,
                    access: noteId.access,
                    type: noteId.type
                })

                await postNote(noteId.title, noteId.bodyNote, noteId.bodyTask, noteId.category, noteId.format, noteId.access, noteId.type);
    
            }catch (error){
                console.error("Errore durante il duplicamento delle note: ", error);
            }
        }

/*
        const viewNoteDetails = async (id) => {

            const result = await getNoteById(id)
            
            noteTitle.value = result.title
            noteBody.value = result.bodyNote
            taskBody.value = result.bodyTask
            noteCategory.value = result.category
            noteFormat.value = result.format
            noteSecurity.value = result.access

            editorVisible.value = !editorVisible.value
            if(editorVisible.value == false){
                    showAddModal.value = false
                    showAddMenu.value = false
                    
            }
        }

        const saveChanges = async () => {
            try {
                const result = await getNoteById(id)
                const updatedNote = await updateNoteById(result._id, result.value);
                console.log('Nota aggiornata:', updatedNote);
        
            } catch (error) {
                console.error('Errore durante il salvataggio delle modifiche:', error);
        }}*/
        const filter = ref("")
        const toggleFilter = computed(() => {
            let filteredNotes = [...notes.value];
            if(filter.value === "Note"){
                return notes.value.filter(note => note.type === filter.value)

            }else if(filter.value === "Task"){
                return notes.value.filter(note => note.type === filter.value)
            
            }else if(filter.value === "Date"){
                console.log("Data Funziona")
                return filteredNotes.sort((a, b) => new Date(formatDate(a.createdAt)) - new Date(formatDate(b.createdAt)))

            }else if(filter.value === "Title"){
                console.log("Titolo Funziona")
                return filteredNotes.sort((a, b) => a.title.localeCompare(b.title))
            
            }else if(filter.value === "Length"){
                console.log("Lunghezza Funziona")
                return filteredNotes.sort((a,b) => a.bodyNote.length - b.bodyNote.length)

            }else if(filter.value === "Category"){
                console.log("Categoria")

            }

            return notes.value
        })

        const formatDate = (date) => {
            if (!date) return '';
            return date.toLocaleString('it-IT', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // (12 hour format)
            });
        }


        const changeFilterDate = () => {
             filter.value = "Date"
        }
        const changeFilterTitle = () => {
            filter.value = "Title"  
        }
        const changeFilterLength = () => {
            filter.value = "Length"
        }
        const changeFilterCategory = () => {
            filter.value = "Category"
            categoryFilter.value = !categoryFilter.value
        }
    
        // refs and methods to show only notes, only tasks, or both
        const inNotePage = ref(false)
        const inTaskPage = ref(false)
        const inAllPage = ref(true)
        const inNoteAdd = ref(false)
        const inTaskAdd = ref(false)

        const notesVisible = ref(true)
        const tasksVisible = ref(true)

        const showNotes = () => {
            notesVisible.value = true
            tasksVisible.value = false
            inNotePage.value = true
            inTaskPage.value = false
            inAllPage.value = false
            filter.value = "Note"
        }

        const showAll = () => {
            tasksVisible.value = true
            notesVisible.value = true
            inNotePage.value = false
            inTaskPage.value = false
            inAllPage.value = true
            filter.value = ""
            
        }

        const showTasks = () => {
            notesVisible.value = false
            tasksVisible.value = true
            inNotePage.value = false
            inTaskPage.value = true
            inAllPage.value = false
            noteFormat.value = "Task"
            filter.value = "Task"
        }

        // filter modal
        const showFilterModal = ref(false)
        const toggleFilterModal = () => {
            showFilterModal.value = !showFilterModal.value
        }

        const inDate = ref(false)
        const inTitle = ref(false)
        const inLength = ref(false)
        const inCategory = ref(false)
        const inButtonDate = () => {
            inDate.value = !inDate.value
        }
        const inButtonTitle = () => {
            inTitle.value = !inTitle.value
        }
        const inButtonLength = () => {
            inLength.value = !inLength.value
        }
        const inButtonCategory = () => {
            inCategory.value = !inCategory.value
        }


        // add note/task menu and modal
        const showAddMenu = ref(false)
        const toggleAddMenu = () => {
            if(largeScreen.value == true){
                showAddModal.value = true
                if(inAllPage.value === true){
                    inNoteAdd.value = true
                    inTaskAdd.value = false
                }else if(inTaskPage.value === true){
                    inNoteAdd.value = false
                    inTaskAdd.value = true
                }else{
                    inNoteAdd.value = true
                    inTaskAdd.value = false
                }
            }else{
                showAddMenu.value = !showAddMenu.value
            }
        }

        const showAddModal = ref(false)
        const toggleAddModal = () => {
            showAddModal.value = !showAddModal.value
            if(inAllPage.value === true || inNotePage.value === true){
                inNoteAdd.value = true
                inTaskAdd.value = false
            }else{
                inNoteAdd.value = false
                inTaskAdd.value = true
            }
        }
       
       const changeN = () => {
            inNoteAdd.value = true
            inTaskAdd.value = false  
            noteType.value = "Note"
        }
        const changeT = () => {
            inNoteAdd.value = false
            inTaskAdd.value = true 
            noteFormat.value = "Task"
            noteType.value = "Task"

        }

        
        const closeAddMenu = () => {
            showAddMenu.value = false
            showAddModal.value = false
            showFilterModal.value = false
        }
        const largeScreen = ref(false)
        const checkScreen = () => {
            largeScreen.value = window.innerWidth >= 768
        }

        onMounted(() => {
            checkScreen()
            window.addEventListener('resize', checkScreen)
        })

        onBeforeMount(() => {
            window.removeEventListener('resize', checkScreen)
        })

        const editorVisible = ref(false)
        const toggleEditor = () => {
            if(noteTitle.value.trim() === '' || noteCategory.value.trim() === ''){
                console.log("errore")
                return
            }else{
                editorVisible.value = !editorVisible.value
                if(editorVisible.value == false){
                    showAddModal.value = false
                    showAddMenu.value = false
                    addNote();   
            }
        }}

        const handleSubmit = (event) => {
            event.preventDefault()
            console.log("dati salvati")
        }
        

        
        const convertedOutput = computed(() => {
            return marked(noteBody.value);
        });

        

        



    

        return {
            notesVisible,
            tasksVisible,
            showNotes,
            showAll,
            showTasks,
            showFilterModal,
            toggleFilterModal,
            showAddMenu,
            toggleAddMenu,
            showAddModal,
            toggleAddModal,
            inNotePage,
            inAllPage,
            inTaskPage,
            inNoteAdd,
            inTaskAdd,
            changeN,
            changeT,
            closeAddMenu,
            inDate,
            inButtonDate,
            hoverImgDate,
            defaultImgDate,
            inTitle,
            inLength,
            inCategory,
            inButtonTitle,
            inButtonLength,
            inButtonCategory,
            defaultImgTitle,
            defaultImgLength,
            defaultImgCategory,
            hoverImgTitle,
            hoverImgLength,
            hoverImgCategory,
            notes,
            editorVisible,
            toggleEditor,
            convertedOutput,
            noteBody,
            taskBody,
            noteTitle,
            noteCategory,
            noteSecurity,
            noteFormat,
            handleSubmit,
            addNote,
            loadNotes,
            taskTitle,
            taskDone,
            tasks,
            addTask,
            toggleEditorTask,
            titles,
            deleteNote,
            duplicateNote,
            toggleFilter,
            changeFilterDate,
            changeFilterTitle,
            changeFilterLength,
            changeFilterCategory,
            filter,
            formatDate,
            categories,
            categoryFilter
            
            
            
        };
}}
</script>

<style></style>