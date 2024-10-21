<template>
    <!--Blur effect-->
    <div class="h-14 fixed bottom-0 left-0 right-0 backdrop-blur-xl 
                lg:hidden"></div>

    <!--NavBar-->
    <div class="grid grid-flow-col auto-cols-auto bg-secondary rounded-3xl fixed bottom-8 left-1/2 -translate-x-1/2 w-10/12 shadow-xl
                lg:bottom-auto lg:top-20 lg:translate-x-0 lg:left-4 max-w-lg">
        <button id="button_note_page" :class="{'text-secondary bg-white rounded-3xl ':inNotePage, 'text-white':!inNotePage }" @click="showNotes" class="p-2 font-bold flex justify-center items-center">Note</button>
        <button id="button_all_page" :class="{'text-secondary bg-white rounded-3xl':inAllPage, 'text-white':!inAllPage}" @click="showAll" class="p-2 font-bold">All</button>
        <button id="button_task_page" :class="{'text-secondary bg-white rounded-3xl':inTaskPage, 'text-white':!inTaskPage}" @click="showTasks" class="p-2 font-bold">Task</button>
    </div>

    <!--Add button-->
    <button @click="toggleAddMenu" class="bg-white h-11 w-11 fixed bottom-20 right-4 rounded-full border-2 border-third
                                    lg:bottom-auto lg:top-20">
        <img class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/add.png" alt="Add">
    </button>

    <!--Filter button-->
    <button @click="toggleFilterModal" class="bg-white h-11 w-11 right-4 fixed bottom-20 rounded-full border-2 border-third invisible
                                    lg:visible lg:bottom-auto lg:top-20 lg:right-20">
        <img class="w-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" src="../images/filterBlack.png" alt="Filter">
    </button>


    <!--Add menu-->
    <div v-show="showAddMenu" @click.self="closeAddMenu" class="fixed top-0 left-0 h-full w-full">
        <div v-show="showAddMenu" class="fixed right-2 bottom-32 z-2 w-48
                                     lg:bottom-auto lg:top-32">
            <div class="bg-white p-2 grid grid-cols-1 rounded-xl border border-third shadow-xl divide-y">
                <button @click="toggleAddModal" v-if="notesVisible && !tasksVisible" class="p-2 text-third font-bold flex justify-between items-center">
                    Add Note
                    <img class="w-4" src="../images/noteBlack.png" alt="add_nota">
                </button>
                <button @click="toggleAddModal" v-if="tasksVisible && !notesVisible" class="p-2 text-third font-bold flex justify-between items-center">
                    Add Task
                    <img class="w-4" src="../images/taskBlue.png" alt="add_nota">
                </button>
                <button @click="toggleAddModal" v-if="notesVisible && tasksVisible" class="p-2 text-third font-bold flex justify-between items-center">
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
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2 max-w-xs w-full border-4 border-third">
            <div class="border border-third fixed top-[52px] left-0 w-full"></div>
            <div class="content bg-white p-2">
                <header class=" flex justify-between items-center">
                    <button :class="{'bg-third text-white':inNoteAdd, 'text-third':!inNoteAdd}" v-show="notesVisible" @click="changeN" class="p-2 px-3 font-bold rounded-xl">Add Note</button>
                    <button :class="{'bg-third text-white':inTaskAdd, 'text-third':!inTaskAdd}" v-show="tasksVisible" @click="changeT" class="p-2 px-3 mr-10 font-bold rounded-xl">Add Task</button> 
                    <button @click="toggleAddModal"><img class="w-4 h-4 mr-2 hover:border-2 border-third" src="../images/x.png" alt="Croce"></button>
                </header>
                <form action="#">
                    <div class="row title p-2  grid grid-row-2">
                        <label class="font-semibold py-1">Title</label>
                        <input class="border border-third caret-third" type="text" id="note_title" required>
                    </div>

                    <div class="row title p-2  grid grid-row-2">
                        <label class="font-semibold py-1">Category</label>
                        <input class="border border-third caret-third" type="text" id="note_category" required>
                    </div>

                    <div class="row access list p-2  grid grid-row-2">
                        <label class="font-semibold py-1" for="access list">Access List</label>
                        <select class="shadow-xl border border-third" name="Access List" id="access_list" required>
                            <option value="publicAccess">Public</option>
                            <option value="limitedAccess">Selected</option>
                            <option value="privateAccess">Private</option>
                        </select>
                    </div>

                    <div class="flex justify-center mx-12 p-4">
                        <button id="SaveButton" class="px-4 py-1 shadow-xl hover:bg-third hover:text-white font-semibold">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!--Filter modal-->  
    <div v-show="showFilterModal" @click.self="closeAddMenu" class="fixed top-0 left-0 bg-black/40 h-full w-full">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2 max-w-xs w-full border-4 border-third">
            <div class="border border-third fixed top-[52px] left-0 w-full"></div>
            <div class="content bg-white p-2 ">
                <header class=" flex justify-between items-center">
                    <p class="p-2 text-third font-bold">Add Filter</p>
                    <button @click="toggleFilterModal"><img class="w-4 h-4 mr-2 hover:border-2 border-third" src="../images/x.png" alt="Croce"></button>
                </header>
                <form action="#">
                    <div class="grid grid-rows-2 grid-cols-2 p-2 cursor-pointer">
                        <button id="buttonDate" :class="{'bg-third text-white':inDate, 'bg-fourth':!inDate}" @mouseenter="inButtonDate" @mouseleave="inButtonDate" class="font-semibold flex flex-col items-center p-2 m-2 rounded-lg">
                            <img id="buttonImage" class="w-5" :src="inDate ? hoverImgDate : defaultImgDate" alt="filtroData">
                            Date
                        </button>
                        <button :class="{'bg-third text-white':inTitle, 'bg-fourth':!inTitle}" @mouseenter="inButtonTitle" @mouseleave="inButtonTitle" class="font-semibold flex flex-col items-center p-2 m-2 rounded-lg">
                            <img class="w-5" :src="inTitle ? hoverImgTitle : defaultImgTitle" alt="filtroTitolo">
                            Title
                        </button>
                        <button :class="{'bg-third text-white':inLength, 'bg-fourth':!inLength}" @mouseenter="inButtonLength" @mouseleave="inButtonLength" class="font-semibold flex flex-col items-center p-2 m-2 rounded-lg">
                            <img class="w-5" :src="inLength ? hoverImgLength : defaultImgLength" alt="filtroLunghezza"> 
                            Length
                        </button>
                        <button :class="{'bg-third text-white':inCategory, 'bg-fourth':!inCategory}" @mouseenter="inButtonCategory" @mouseleave="inButtonCategory" class="font-semibold flex flex-col items-center p-2 m-2 rounded-lg">
                            <img class="w-5" :src="inCategory ? hoverImgCategory : defaultImgCategory" alt="filtroCategoria"> 
                            Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- v-for tasks (probabilmente?) -->
    <!--Tasks-->
    <div class="grid grid-cols-1 mx-10 my-20 gap-8 lg:grid-cols-3 lg:my-40">
        <div v-show="notesVisible" class="h-32 rounded-r-xl rounded-bl-xl bg-white border-4 border-third shadow-2xl overflow-hidden">
            <h5 class="p-1 h-1/4 m-1 bg-fourth font-medium flex items-center text-third">NotaUnoooooooo</h5>
            <p class="px-2 text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia reprehenderit accusantium
                 consequatur ratione ullam, odio impedit vero provident corrupti et velit, 
                numquam perspiciatis natus mollitia deleniti, eligendi voluptatum vitae est?</p>      
        </div>

        <div v-show="notesVisible" class="h-32 rounded-r-xl rounded-bl-xl bg-white border-4 border-third shadow-2xl overflow-hidden">
            <h5 class="p-1 h-1/4 m-1 bg-fourth font-medium flex items-center text-third">NotaDueeeeee</h5>
            <p class="px-2 text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia reprehenderit accusantium
                consequatur ratione ullam, odio impedit vero provident corrupti et velit, 
               numquam perspiciatis natus mollitia deleniti, eligendi voluptatum vitae est?</p>

        </div>
        <div v-show="tasksVisible" class="h-32 rounded-r-xl rounded-bl-xl bg-white border-4 border-third shadow-2xl overflow-hidden">
            <h5 class="p-1 h-1/4 m-1 bg-secondary font-medium flex items-center text-white">TaskUnoooooooo</h5>
            <p class="px-2 text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia reprehenderit accusantium
                consequatur ratione ullam, odio impedit vero provident corrupti et velit, 
               numquam perspiciatis natus mollitia deleniti, eligendi voluptatum vitae est?</p>

        </div>

        <div v-show="notesVisible" class="h-32 rounded-r-xl rounded-bl-xl bg-white border-4 border-third shadow-2xl overflow-hidden">
            <h5 class="p-1 h-1/4 m-1 bg-fourth font-medium flex items-center text-third">NotaQuattroo</h5>
            <p class="px-2 text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia reprehenderit accusantium
                consequatur ratione ullam, odio impedit vero provident corrupti et velit, 
               numquam perspiciatis natus mollitia deleniti, eligendi voluptatum vitae est?</p>

        </div>

        <div v-show="tasksVisible" class="h-32 rounded-r-xl rounded-bl-xl bg-white border-4 border-third shadow-2xl overflow-hidden">
            <h5 class="p-1 h-1/4 m-1 bg-secondary font-medium flex items-center text-white">TaskDueeeeeeee</h5>
            <p class="px-2 text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia reprehenderit accusantium
                consequatur ratione ullam, odio impedit vero provident corrupti et velit, 
               numquam perspiciatis natus mollitia deleniti, eligendi voluptatum vitae est?</p>

        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import defaultImgDate from "../images/filtrodata.png"
import hoverImgDate from "../images/filtrodatab.png"
import defaultImgTitle from "../images/filtrotitolo.png"
import hoverImgTitle from "../images/titleFilterWhite.png"
import defaultImgLength from "../images/filtrolunghezza.png"
import hoverImgLength from "../images/lengthFilterWhite.png"
import defaultImgCategory from "../images/filtrocategoria.png"
import hoverImgCategory from "../images/categoryFilterWhite.png"

export default {
    setup() {
        const inNotePage = ref(false)
        const inTaskPage = ref(false)
        const inAllPage = ref(true)

        const inNoteAdd = ref(false)
        const inTaskAdd = ref(false)

        // refs and methods to show only notes, only tasks, or both
        const notesVisible = ref(true)
        const tasksVisible = ref(true)
        
        const showNotes = () => {
            notesVisible.value = true
            tasksVisible.value = false
            inNotePage.value = true
            inTaskPage.value = false
            inAllPage.value = false
            
        }

        const showAll = () => {
            tasksVisible.value = true
            notesVisible.value = true
            inNotePage.value = false
            inTaskPage.value = false
            inAllPage.value = true
        }

        const showTasks = () => {
            notesVisible.value = false
            tasksVisible.value = true
            inNotePage.value = false
            inTaskPage.value = true
            inAllPage.value = false
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
            showAddMenu.value = !showAddMenu.value
        }
        const showAddModal = ref(false)
        const toggleAddModal = () => {
            showAddModal.value = !showAddModal.value
            inNoteAdd.value = false
            inTaskAdd.value = false
        }

        const changeN = () => {
            inNoteAdd.value = true
            inTaskAdd.value = false
        }

        const changeT = () => {
            inNoteAdd.value = false
            inTaskAdd.value = true
        }

        const closeAddMenu = () => {
            showAddMenu.value = false
            showAddModal.value = false
            showFilterModal.value = false
        }

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
            hoverImgCategory
        }
    }
}
</script>

<style>

</style>