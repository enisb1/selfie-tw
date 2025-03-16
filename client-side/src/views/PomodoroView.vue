<template>

  <div class="fixed h-full w-full grid grid-rows-[1fr_2fr_2fr] gap-2 bg-prova bg-cover">
    <div class="relative">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:left-10 md:translate-x-0 text-white">
            <div class="font-bold flex items-end justify-center">
                P
                <img class="w-6 h-6 mb-1" src="@/images/timer.png" alt="timer">
                modoro 
            </div>
            <div class="font-semibold flex justify-center">Timer</div>
        </div>
    </div>
    <div class="relative z-10">
        <div class="absolute left-1/2 top-0 -translate-x-1/2 w-9/12 h-4/5 rounded-3xl flex justify-center max-w-96 max-h-60 transition-colors duration-1000"
             :class="{'bg-eighth': timeStudy, 'bg-seventh': !timeStudy}">
            <button @click="showCurrentSettings" class="absolute right-2 top-5 w-4"><img src="@/images/side.png" alt="side"></button>
            <div class="absolute w-10/12 h-3/6 top-5 rounded-t-3xl rounded-b-xl bg-white">
            <span class="absolute text-xl font-medium left-1/2 -translate-x-1/2 top-1 text-secondary"> {{cicleState}} #{{(numCicli+1)-nCicle}} </span>
            <div class="absolute w-1/2 h-2/5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full max-h-12 transition-colors duration-1000"
                 :class="{'bg-eighth': timeStudy, 'bg-seventh': !timeStudy}">
                <div class="absolute h-4/6 left-4 right-4 top-1/2 -translate-y-1/2 rounded-full border-2 border-black md:h-5/6"></div>
                <div class="absolute left-3 top-1/2 -translate-y-1/2">
                    <img class="h-9 sm:h-10" src="@/images/rotella.png" alt="wheel" :class="{'animate-spin':isPressed}">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary h-5 w-5 sm:h-6 sm:w-6">
                        <img src="@/images/provap.png" alt="wheelWheel" :class="{'animate-spin':isPressed}">
                        <span v-if="timeStudy" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black h-9 w-9"
                             :class="{'animate-tapesx': isPressed, 'animate-stop':!isPressed}" :style="{'--animation-duration': minuteStudy + 's', '--elapsed-time': minuteStudy-mStudy + 's', 'animation-play-state': isPressed ? 'paused':'running',
                                       'border-width': isPressed ? (8*(minuteStudy-mStudy)/minuteStudy)+'px' :(8*(minuteStudy-mStudy)/minuteStudy)+'px'}"></span>
                        <span v-else class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black h-9 w-9"
                             :class="{'animate-tapesx': isPressed, 'animate-stop':!isPressed}" :style="{'--animation-duration': minuteRelax + 's', '--elapsed-time': minuteRelax-mRelax + 's', 'animation-play-state': isPressed ? 'paused':'running',
                                      'border-width': isPressed ? (8*(minuteRelax-mRelax)/minuteRelax)+'px' :(8*(minuteRelax-mRelax)/minuteRelax)+'px'}"></span>
                    </div>
                </div>
                <div class="absolute right-3 top-1/2 -translate-y-1/2">
                    <img class="h-9 sm:h-10" src="@/images/rotella.png" alt="wheel" :class="{'animate-spin':isPressed}">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary h-5 w-5 sm:h-6 sm:w-6">
                        <img src="@/images/provap.png" alt="wheelWheel" :class="{'animate-spin':isPressed}">
                        <span v-if="timeStudy" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black h-9 w-9"
                             :class="{'animate-tapedx': isPressed, 'animate-stop':!isPressed}" :style="{'--animation-duration': minuteStudy + 's', '--elapsed-time': minuteStudy-mStudy + 's', 'animation-play-state': isPressed ? 'paused':'running',
                                      'border-width': isPressed ? (8-(8*(minuteStudy-mStudy)/minuteStudy))+'px' :(8-(8*(minuteStudy-mStudy)/minuteStudy))+'px'}"></span>
                        <span v-else class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black h-9 w-9"
                             :class="{'animate-tapedx': isPressed, 'animate-stop':!isPressed}" :style="{'--animation-duration': minuteRelax + 's', '--elapsed-time': minuteRelax-mRelax + 's', 'animation-play-state': isPressed ? 'paused':'running',
                                      'border-width': isPressed ? (8-(8*(minuteRelax-mRelax)/minuteRelax))+'px' :(8-(8*(minuteRelax-mRelax)/minuteRelax))+'px'}"></span>
                    </div>
                </div>
            </div>
            <span class="absolute text-2xl font-bold bottom-6 left-1/9 text-secondary">{{ side }}</span>
            <span class="absolute text-xs bottom-4 left-1/11 text-secondary">SIDE</span>
            <span class="absolute text-xl font-medium left-1/2 -translate-x-1/2 bottom-1 text-secondary">STEREO</span>
            <button @click="showOptionsMenu" ><img class="absolute right-1/11 bottom-4 w-8" src="@/images/options.png" alt="opzion"></button>
            </div>
            <div class="absolute bottom-0 h-2/5 w-full flex items-center">
                <div class="absolute left-1/11 flex items-center">
                    <button @click="resetCicle" class=""><img class="w-6" src="@/images/replaybutton.png" alt="replay"></button>
                </div>
                <div class="left-1/2 top-1/2 translate-x-1/2 w-1/2 h-3/5 bg-white text-5xl text-center text-secondary">
                    {{ time }}
                
                </div>
                <div class="absolute right-1/11 flex items-center">
                    <button @click="skipCicle" v-show="isPressed" class=""><img class="" src="@/images/skipbutton.png" alt="skip"></button>
                    <button @click="finishCicle" v-show="!isPressed" class=""><img class="w-6" src="@/images/finishbuttonn.png" alt="finishCicle"></button>
                </div>
            </div>

            <div class="absolute left-1/2 -translate-x-1/2 -bottom-8 h-2 w-full border border-white">
                <div v-if="timeStudy" class="h-full bg-eighth transition-[width]" :class="{'animate-loading': isPressed, 'animate-stop': !isPressed}"
                :style="{'--animation-duration': minuteStudy + 's', '--elapsed-time': minuteStudy-mStudy + 's', 
                         'animation-play-state': isPressed ? 'paused':'running', 'width': isPressed ? (100*(minuteStudy-mStudy)/minuteStudy)+'%':(100*(minuteStudy-mStudy)/minuteStudy)+'%'}"></div>
                <div v-else class="h-full bg-fifth w-0" :class="{'animate-loading': isPressed, 'animate-stop': !isPressed}"
                :style="{'--animation-duration': minuteRelax + 's', '--elapsed-time': minuteRelax-mRelax + 's', 'animation-play-state': isPressed ? 'paused':'running',
                         'width': isPressed ? (100*(minuteRelax-mRelax)/minuteRelax)+'%':(100*(minuteRelax-mRelax)/minuteRelax)+'%'}"></div>
            </div>

            <div class="absolute left-1/2 -translate-x-1/2 -bottom-24 flex">
                <button @click="startTimer" class="max-w-40 min-w-36 py-1 rounded-2xl w-1/3 font-semibold text-2xl transition-all duration-500" 
                                       :class="{'transform translate-y-1': isPressed, 'border-b-4 border-white':!isPressed, 'bg-eighth text-secondary': timeStudy, 'bg-seventh text-secondary': !timeStudy}">
                    {{ buttonText }}
                </button>
            </div>


            <button></button>

        </div>   
    </div>
    <Modal v-show="currentSettings" @click.self="showCurrentSettings">
        <p class="mb-4 text-center text-secondary font-semibold">Current Settings</p>
        <div class="grid grid-cols-1 gap-2 font-semibold text-white md:grid-cols-3">
            <div class="flex items-center justify-center rounded-xl bg-secondary px-2">TIME STUDY {{minuteStudy/60}}'</div>
            <div class="flex items-center justify-center rounded-xl bg-secondary px-2">TIME RELAX {{minuteRelax/60}}'</div>
            <div class="flex items-center justify-center rounded-xl bg-secondary px-2">NUMBER CYCLES {{numCicli}}</div>
        </div>
        <button @click="showShareTrigger" class="bg-secondary text-white font-semibold rounded-xl p-2 w-full mt-4">Share configuration</button>
    </Modal>

    <Modal v-show="showShare" @click.self="showShareTrigger">
        <div class="flex flex-col items-center justify-center">
            <p class="text-center text-secondary font-semibold">Share your study configuration with a friend</p>
            <input type="text" class="w-1/2 p-2 mt-4 rounded-xl" placeholder="Enter the username" v-model="receiver">
            <button @click="shareStudyConfig(receiver)" class="bg-secondary text-white font-semibold rounded-xl p-2 w-24 mt-4">Share</button>
            <p class="text-red-500">{{ shareError }}</p>
        </div>

    </Modal>

    <div class="relative">
        <div class="absolute top-1/2 left-1/2 -translate-y-2/3 -translate-x-1/2 h-1/3 w-1/4 max-w-80 rounded-2xl min-w-40 border-4
                    md:right-10 md:left-auto md:translate-x-0"
                    :class="{'border-seventh':!timeStudy, 'border-eighth': timeStudy}">
            <iframe class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-full w-full rounded-xl" src="https://www.youtube.com/embed/jfKfPfyJRdk?si=GcaboFudiu7ISCG4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>

    </div>
  </div>
    <!--Options Menu-->
    <Modal v-show="showMenu" @click.self="showOptionsMenu">
        <div class="overflow-scroll max-h-96">
            <div>Time (minutes)</div>
            <div class="grid grid-cols-3 text-center py-4">
                <div>
                    Study
                    <div class="flex justify-center items-center gap-2">
                        <div>{{minSetStudy/60}}'</div> 
                        <div class="grid grid-cols-1">
                            <button @click="increaseStudy">
                                <img class="w-3" src="@/images/arrowup.png" alt="arrowUp">
                            </button>
                            <button @click="decreaseStudy">    
                                <img class="w-3" src="@/images/arrowdown.png" alt="arrowDown">
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    Relax
                    <div class="flex justify-center items-center gap-2">
                        <div>{{minSetRelax/60}}'</div> 
                        <div class="grid grid-cols-1">
                            <button @click="increaseRelax">
                                <img class="w-3" src="@/images/arrowup.png" alt="arrowUp">
                            </button>
                            <button @click="decreaseRelax">    
                                <img class="w-3" src="@/images/arrowdown.png" alt="arrowDown">
                            </button>
                        </div>
                    </div>
                </div>   
                <div>
                    Cycles 
                    <div class="flex justify-center items-center gap-2">
                        <div>{{numSetCycle}}</div> 
                        <div class="grid grid-cols-1">
                            <button @click="increaseCycle">
                                <img class="w-3" src="@/images/arrowup.png" alt="arrowUp">
                            </button>
                            <button @click="decreaseCycle">    
                                <img class="w-3" src="@/images/arrowdown.png" alt="arrowDown">
                            </button>
                        </div>
                    </div>
                </div> 
            </div>
            <div class="flex justify-center gap-2">
                <button @click="saveCicleCustom" class="bg-secondary text-white font-semibold rounded-xl p-2">Save</button>
                <button @click="togglePomodoroEventModal" class="bg-secondary text-white font-semibold rounded-xl p-2">Create event</button>
            </div>
            <div class="mt-4">
                <label for="">Total Time
                    <input type="number" class="w-full px-1 mt-1" placeholder="enter the minutes" v-model="minutesNumber">
                </label>
                <div class="flex justify-center">
                    <button class="bg-secondary mt-3 text-white font-semibold rounded-xl p-2 my-4" @click="validNumber">
                        Possible cycles
                    </button>
                </div>
                <div class="mt-2" v-for="(cicle,index) in cicles" :key="index">
                    <div @click="saveCicle(index)" class="w-full p-2 my-1 rounded-lg flex justify-center gap-8 text-center font-semibold"
                                                  :class="{'bg-white text-secondary': index==0, 'bg-secondary text-white': index!==0}">
                        <div class="w-1/3">Study:<br> {{ cicle.study }}' </div>
                        <div class="w-1/3">Relax:<br> {{cicle.relax}}' </div>
                        <div class="w-1/3">Cycles:<br> {{cicle.ncicle}}</div>
                    </div>
                </div>
            </div>
        </div>
    </Modal>

    <Modal v-show="showPomodoroEventModal" @close="togglePomodoroEventModal">
        <header>
            <div class="flex items-center justify-between flex-row">
                <p class="font-bold text-truncate text-lg">Add pomodoro event</p>
                <button type="button" @click="togglePomodoroEventModal"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
                src="../images/x.png" alt="Croce"></button>
            </div>
            <hr style="border-color: black"/>
        </header>
        <form @submit.prevent="addPomodoroEvent">
            <!-- studying cycle recap -->
            <div class="mt-4">
                <p class="font-semibold text-base">Studying cycle to add</p>
                <div class="rounded-md">
                    <p>Study: {{ minSetStudy/60 }}</p>
                    <p>Relax: {{ minSetRelax/60 }}</p>
                    <p>Cycles: {{ numSetCycle }}</p>
                </div>
            </div>

            <!-- title -->
            <div class="mt-4">
                <p class="font-semibold text-base">Title</p>
                <input class="border border-third" type="text" maxlength="20" required v-model="pomodoroEventTitle">
            </div>

            <!-- start -->
            <div class="mt-4">
                <p class="font-semibold text-base">Start of cycle</p>
                <DatePicker class="mt-px inline-block w-auto" v-model="pomodoroEventStartDate" 
                    :format="formatDate" minutes-increment="5" :start-time="startTime" required></DatePicker>
            </div>

            <button type="submit" class="w-full mt-4 rounded-md bg-secondary px-3 py-2 text-md font-semibold 
                text-white shadow-sm ring-1 ring-inset ring-gray-300">Add</button>
        </form>
    </Modal>
  
</template>


<script>
import {ref, onMounted, watch, onUnmounted} from 'vue'
import Modal from "@/components/Modal.vue";
import {sharePomodoroConfig} from "@/apis/notifications";
import {useStore} from "vuex";
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import {checkUsername} from "@/apis/users";
import { postSettingsPom } from "@/apis/pomodoro";
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { postEvent } from '@/apis/calendar';
import { useRouter } from 'vue-router';

export default {

    components:{
        Modal,
        DatePicker
    },

    setup(){
        const route = useRoute();
        const store = useStore()
        const router = useRouter()
        
        const study = computed(() => Number(route.query.study) || 1800);
        const relax = computed(() => Number(route.query.relax) || 300);
        const cycles = computed(() => Number(route.query.cycles) || 5);
        const pushedRouteEventTitle = route.query.eventTitle
        const pushedRouteEventDate = route.query.eventDate
        //TODO:
        // metti nella query un parametro per segnare che è un pomodoroEvent
        // metti un check che quando esci dalla view, onUnMount probabilmente, controlli 
        // se è un pomodoroEvent e se sì allora fai il post dell'evento al giorno dopo 
        // con la stessa configurazione e i cicli rimanenti (stesso orario quindi devi
        // passare anche la Date string nei parametri della query)
        
        const cicles = ref([
            {
                relax: relax,
                ncicle: cycles,
                study: study
            }
        ])

        // POMODORO EVENT
        const togglePomodoroEventModal = () => {
            if (showPomodoroEventModal.value) {
                showPomodoroEventModal.value = false
            }
            else {
                showMenu.value = false
                pomodoroEventTitle.value = ''
                pomodoroEventStartDate.value = null
                showPomodoroEventModal.value = true
            }
        }
        const showPomodoroEventModal = ref(false)

        const addPomodoroEvent = async () => {
            const endDate = new Date(pomodoroEventStartDate.value)
            endDate.setSeconds(endDate.getSeconds() + (minSetStudy.value + minSetRelax.value) * numSetCycle.value)
            await postEvent(pomodoroEventTitle.value, null, pomodoroEventStartDate.value, endDate, 'none', null, 
                null, '#b01e1e', [], store.state._id, [], false, false, false, false, {minStudy: minSetStudy.value/60, minRelax: minSetRelax.value/60, cycles: numSetCycle.value})
            togglePomodoroEventModal()
        }

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
        const startTime = ref({ hours: 12, minutes: 30 })

        const pomodoroEventStartDate = ref()
        const pomodoroEventTitle = ref()
        // --- end pomodoro event ---

        const audio = new Audio("/soundbutton.mp3")
        const audioReset = new Audio("/soundReset.mp3")
        const audioFinish = new Audio("/finishsound.mp3")
        const nextStage = new Audio("/nextstage.mp3")
        const buttonText = ref("PLAY")
        const minutes = ref()
        const time = ref()
        let interval
        const numCicli = ref(cycles)
        const minuteStudy = ref(study)
        const minuteRelax = ref(relax)
        const mstudy = ref()
        const side = ref("A")
        const cicleState = ref("STUDY")
        const user = ref("")

        const mRelax = ref()
        const mStudy = ref()
        const nCicle = ref()

        const minSetStudy = ref()
        const minSetRelax = ref()
        const numSetCycle = ref()

        const showShare = ref(false)
        const receiver = ref()


        // --------
        // Shared alert logic
        const showLeaveAlert = () => {
            return confirm('Are you sure you want to leave?');
        };

        let removeRouteGuard;
        let beforeUnloadAdded = false;

        // handle navigation outside and inside vue project
        const addNavigationGuard = () => {
            // handling navigation inside vue project
            if (!removeRouteGuard) {
                removeRouteGuard = router.beforeEach((to, from, next) => {
                const confirmation = window.confirm('Are you sure you want to leave this page?');

                if (confirmation) {
                    next(); // Allow navigation
                } else {
                    next(false); // Prevent navigation
                }
                });
            }
            // handling navigation outside vue project (to projects.html)
            if (!beforeUnloadAdded) {
                window.addEventListener('beforeunload', handleUnload)
                beforeUnloadAdded = true
            }
            
        }

        const removeNavigationGuard = () => {
            window.removeEventListener('beforeunload', handleUnload)
            beforeUnloadAdded = false
            if (removeRouteGuard) removeRouteGuard(); //  router.beforeEach returns a function that, when called, 
                                                      //  removes the guard from the router
        }

        onMounted(() => {
            nCicle.value = numCicli.value
            mStudy.value = minuteStudy.value
            minSetRelax.value = minuteRelax.value
            minSetStudy.value = minuteStudy.value
            numSetCycle.value = numCicli.value
            time.value = formatTime(minuteStudy.value)
            user.value = store.state.username
        });

        // 2. Handle External Navigation (Outside Vue)
        const handleUnload = (event) => {
            event.preventDefault();
            event.returnValue = ''; // triggers the native confirmation dialog
        };

        onUnmounted(() => {
            removeNavigationGuard()
        });

        /*
        codice da chiamare quando si termina un pomodoro event in corso d'oopera
        // nCicle contiene i cicli rimanenti
            if (isPressed.value && pushedRouteEventTitle) {    // is pomodoro event
                const startDate = new Date(pushedRouteEventDate)
                startDate.setTime(startDate.getTime() + 24 * 60 * 60 * 1000)
                const endDate = new Date(startDate)
                endDate.setSeconds(endDate.getSeconds() + (minSetStudy.value + minSetRelax.value) * nCicle.value)
                await postEvent(pushedRouteEventTitle, null, startDate, endDate, 'none', null, 
                    null, '#b01e1e', [], store.state._id, [], false, false, false, false, {minStudy: minSetStudy.value/60, minRelax: minSetRelax.value/60, cycles: nCicle.value})
            }
        */
        // --------

        const saveCicle = (index) => {
            showMenu.value = false
            numCicli.value = cicles.value[index].ncicle
            minuteRelax.value = (cicles.value[index].relax)*60
            minuteStudy.value = (cicles.value[index].study)*60
            mRelax.value = (cicles.value[index].relax)*60
            mStudy.value = (cicles.value[index].study)*60
            minSetRelax.value = (cicles.value[index].relax)*60
            minSetStudy.value = (cicles.value[index].study)*60
            numSetCycle.value = cicles.value[index].ncicle
            time.value = formatTime(minuteStudy.value)
            nCicle.value = cicles.value[index].ncicle
            timeStudy.value = true
            minutesNumber.value = ""
            cicles.value = [
                    {
                        relax: 5,
                        ncicle: 5,
                        study: 30
                    }
                ]
            console.log(user, minSetStudy, minSetRelax, numSetCycle)
            postSettingsPom(minSetStudy, minSetRelax, numSetCycle, user)
        }


        const formatTime = (minutes) => {
            const m = Math.floor(minutes/60)
            const s = minutes%60
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
        }


        const isPressed = ref(false)
        const timeStudy = ref(true)
        const startTimer = () => {
            audio.play()
            addNavigationGuard()
            isPressed.value = !isPressed.value
                if(timeStudy.value === true){
                    if(isPressed.value === true){
                        buttonText.value = "PAUSE"
                        interval = setInterval(() => {
                            mStudy.value--
                            time.value = formatTime(mStudy.value)
                            if(mStudy.value === 0){
                                isPressed.value = false
                                audio.play()
                                clearInterval(interval)
                                buttonText.value = "PLAY"
                                timeStudy.value = false
                                mRelax.value = minuteRelax.value
                                time.value = formatTime(mRelax.value)
                            }
                        }, 1000)
                        console.log(nCicle.value)
                    }else{
                        buttonText.value = "PLAY"
                        clearInterval(interval)
                    }       
                }else{
                    if(isPressed.value === true){
                        buttonText.value = "PAUSE"
                        interval = setInterval(() => {
                            mRelax.value--
                            time.value = formatTime(mRelax.value)
                            if(mRelax.value === 0 && nCicle.value === 1){
                                audio.play()
                                nCicle.value = numCicli.value
                                mStudy.value = minuteStudy.value
                                mRelax.value = minuteRelax.value
                                timeStudy.value = true
                                isPressed.value = false
                                clearInterval(interval)
                                time.value = formatTime(minuteStudy.value)
                                audioFinish.play()
                                removeNavigationGuard()
                            }
                            else if(mRelax.value === 0){
                                isPressed.value = false
                                audio.play()
                                clearInterval(interval)
                                buttonText.value = "PLAY"
                                timeStudy.value = true
                                mStudy.value = minuteStudy.value
                                nCicle.value--
                                time.value = formatTime(mStudy.value)
                            }
                        }, 1000)
                    }else{
                        buttonText.value = "PLAY"
                        clearInterval(interval)
                    }
                }   
        }


        const showMenu = ref(false)
        const isInteger = ref(true)
        const minutesNumber = ref()

        const showOptionsMenu = () => {
            showMenu.value = !showMenu.value
            if(showMenu.value === false){
                minutesNumber.value = null
                cicles.value = [
                    {
                        relax: 5,
                        ncicle: 5,
                        study: 30
                    }
                ]
            }
        }

        const validNumber = () => {
            if(Number.isInteger(minutesNumber.value)){
                isInteger.value = true
                calcoloCicli()
            }else{
                isInteger.value = false
            }
        }

        const calcoloCicli = () => {
            mstudy.value = 35
            let cicli = ~~(minutesNumber.value / 35)
            let tempopausatot = minutesNumber.value % 35
            while(tempopausatot/cicli <= 15 && cicli >= 1){
                if(tempopausatot/cicli == 5){
                    cicles.value.push({relax: tempopausatot/cicli, ncicle: cicli, study: mstudy})
                }else if(tempopausatot/cicli == 10){
                    cicles.value.push({relax: tempopausatot/cicli, ncicle: cicli, study: mstudy})
                }else if(tempopausatot/cicli == 15){
                    cicles.value.push({relax: tempopausatot/cicli, ncicle: cicli, study: mstudy})
                }
                cicli--
                tempopausatot = minutesNumber.value - (35*cicli)
            } 
        }   

        const resetCicle = () => {
            audioReset.play()
            removeNavigationGuard()
            buttonText.value = "PLAY"
            nCicle.value = numCicli.value
            mStudy.value = minuteStudy.value
            mRelax.value = minuteRelax.value
            timeStudy.value = true
            isPressed.value = false
            clearInterval(interval)
            time.value = formatTime(minuteStudy.value)
        }

        const finishCicle = () => {
            audio.play()
            nCicle.value = numCicli.value
            mStudy.value = minuteStudy.value
            mRelax.value = minuteRelax.value
            timeStudy.value = true
            isPressed.value = false
            clearInterval(interval)
            time.value = formatTime(minuteStudy.value)
            buttonText.value = "PLAY"
            audioFinish.play()
            removeNavigationGuard()
        }

        const skipCicle = () => {
            if(timeStudy.value === true){
                isPressed.value = false
                audio.play()
                clearInterval(interval)
                buttonText.value = "PLAY"
                timeStudy.value = false
                mRelax.value = minuteRelax.value
                time.value = formatTime(mRelax.value)    

            }else if(timeStudy.value === false && nCicle.value === 1){
                audio.play()
                nCicle.value = numCicli.value
                mStudy.value = minuteStudy.value
                mRelax.value = minuteRelax.value
                timeStudy.value = true
                isPressed.value = false
                clearInterval(interval)
                time.value = formatTime(minuteStudy.value)
                buttonText.value = "PLAY"
                audioFinish.play()
                removeNavigationGuard()
            }else{
                isPressed.value = false
                audio.play()
                clearInterval(interval)
                buttonText.value = "PLAY"
                timeStudy.value = true
                mStudy.value = minuteStudy.value
                nCicle.value--
                time.value = formatTime(mStudy.value)
            }
        }

        watch(timeStudy, (newValue) => {
            side.value = newValue ? 'A' : 'B'
            cicleState.value = newValue ? 'STUDY' : 'RELAX'
            nextStage.play()
            Notification.requestPermission().then(perm => {
                if(perm === "granted"){
                    new Notification("Congratulations", {
                        body: "You have moved on to the next stage",
                        icon: "favicon.ico", 
                    })
                }
            })
        })

        

        const currentSettings = ref(false)
        const showCurrentSettings = () => {
            currentSettings.value = !currentSettings.value
        }

    
        const increaseStudy = () => {
            minSetStudy.value = minSetStudy.value + 60
        }
        const increaseRelax = () => {
            minSetRelax.value = minSetRelax.value + 60
        }
        const increaseCycle = () => {
            numSetCycle.value++
        }
        const decreaseStudy = () => {
            if(minSetStudy.value === 0){
                return
            }else{
                minSetStudy.value = minSetStudy.value - 60
            }
        }
        const decreaseRelax = () => {
            if(minSetRelax.value === 0){
                return
            }else{
                minSetRelax.value = minSetRelax.value - 60
            }
        }
        const decreaseCycle = () => {
            numSetCycle.value--
        }

        const saveCicleCustom = () => {
            showMenu.value = false
            numCicli.value = numSetCycle.value
            minuteRelax.value = minSetRelax.value
            minuteStudy.value = minSetStudy.value
            mRelax.value = minSetRelax.value
            mStudy.value = minSetStudy.value
            if(timeStudy.value === true){
                time.value = formatTime(minuteStudy.value)
            }else{
                time.value = formatTime(minuteRelax.value)
            }
            nCicle.value = numSetCycle.value
            minutesNumber.value = ""
            postSettingsPom(minSetStudy, minSetRelax, numSetCycle, user)
        }

        const shareError = ref("")

        const shareStudyConfig = async (receiver) => {
          // check if the receiver is a valid username
          const data = await checkUsername(receiver);

          if(data.message === "Username not available"){
            await sharePomodoroConfig(store.state.username,receiver,minuteStudy.value, minuteRelax.value, numCicli.value)
            showShareTrigger()
            currentSettings.value = false
          }else {
            shareError.value = "Insert a valid username"
          }

        }

        const showShareTrigger = () => {
            showShare.value = !showShare.value
            shareError.value = ""
        }
        
        return{
            isPressed,
            showMenu,
            startTimer,
            showOptionsMenu,
            Modal,
            validNumber,
            isInteger,
            minutesNumber,
            calcoloCicli,
            cicles,
            buttonText,
            time,
            interval,
            minutes,
            formatTime,
            saveCicle,
            numCicli,
            minuteRelax,
            minuteStudy,
            timeStudy,
            mRelax,
            mStudy,
            nCicle,
            resetCicle,
            finishCicle,
            skipCicle,
            audioReset,
            side,
            cicleState,
            showCurrentSettings,
            currentSettings,
            increaseStudy,
            increaseRelax,
            increaseCycle,
            decreaseStudy,
            decreaseRelax,
            decreaseCycle,
            minSetRelax,
            minSetStudy,
            numSetCycle,
            saveCicleCustom,
            nextStage,
            shareStudyConfig,
            showShare,
            showShareTrigger,
            receiver,
            shareError,
            store,
            user,
            togglePomodoroEventModal,
            showPomodoroEventModal,
            formatDate,
            startTime,
            pomodoroEventStartDate,
            pomodoroEventTitle,
            addPomodoroEvent
    }

}}
</script>

<style>

.h-1\/8 {
  height: 12.5%;
}

.top-1\/8 {
  top: 12.5%;
}

.left-1\/11 {
  left: 9.090909%;
}

.left-1\/9 {
  left: 11.111111%;
}

.right-1\/9 {
  right: 11.111111%;
}

.right-1\/11 {
  right: 9.090909%;
}

.w-2\/15 {
  width: 13.333333%;
}


@keyframes loading {
    from {
        width: 0%;
    }
    to {
        width: 100%;
    }
}

@keyframes tapesx {
    from {
        border-width: 1px;
    }
    to{
        border-width: 8px;
    }
}

@keyframes tapedx {
    from {
        border-width: 8px;
    }
    to{
        border-width: 1px;
    }
}

:root {
    --animation-duration: 5s;
    --elapsed-time: 0s;
}

.animate-loading {
    animation: loading var(--animation-duration) linear infinite;
    animation-play-state: running ;
    animation-delay: calc(var(--elapsed-time)* -1);
}

.animate-stop {
    animation: stop var(--animation-duration) linear infinite;
    animation-play-state: paused ;
    animation-delay: calc(var(--elapsed-time)* -1);
}

.animate-tapesx {
    animation: tapesx var(--animation-duration) linear infinite; 
    animation-play-state: running ;
    animation-delay: calc(var(--elapsed-time)* -1);
}

.animate-tapedx {
    animation: tapedx var(--animation-duration) linear infinite; 
    animation-play-state: running ;
    animation-delay: calc(var(--elapsed-time)* -1);
}

</style>