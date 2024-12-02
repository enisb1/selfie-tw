<template>

  <div class="fixed h-full w-full grid grid-rows-[1fr_2fr_2fr] gap-2 transition-colors duration-1000"
      :class="{'bg-primary': timeStudy, 'bg-secondary': !timeStudy}">
    <div class="relative">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl md:left-10 md:translate-x-0 transition-colors duration-1000"
            :class="{'text-secondary': timeStudy, 'text-white': !timeStudy}">
            <div class="font-bold flex items-end justify-center">
                P
                <img v-if="!timeStudy" class="w-6 h-6 mb-1" src="@/images/timer.png" alt="timer">
                <img v-else class="w-6 h-6 mb-1" src="@/images/timersecondary.png" alt="timersecondary">
                modoro
            </div>
            <div class="font-semibold flex justify-center">Timer</div>
        </div>
    </div>
    <div class="relative z-10">
        <div class="absolute left-1/2 top-0 -translate-x-1/2 w-9/12 h-4/5 rounded-3xl flex justify-center max-w-96 max-h-60 bg-fifth">
            <div class="absolute w-10/12 h-3/6 top-5 rounded-t-3xl rounded-b-xl bg-white">
            <div class="absolute w-1/2 h-2/5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full max-h-12 bg-fifth">
                <div class="absolute h-4/6 left-4 right-4 top-1/2 -translate-y-1/2 rounded-full border-2 border-black md:h-5/6"></div>
                <div class="absolute left-3 top-1/2 -translate-y-1/2">
                    <img class="h-9 sm:h-10" src="@/images/rotella.png" alt="wheel" :class="{'animate-spin':isPressed}">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary h-5 w-5 sm:h-6 sm:w-6">
                        <img src="@/images/provap.png" alt="wheelWheel" :class="{'animate-spin':isPressed}">
                        <span v-if="timeStudy" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-1 border-black h-9 w-9"
                             :class="{'animate-tapesx': isPressed, 'animate-stop':!isPressed}" :style="{'--animation-duration': minuteStudy + 's', '--elapsed-time': minuteStudy-mStudy + 's', 'animation-play-state': isPressed ? 'paused':'running'}"></span>
                        <span v-else class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-1 border-black h-9 w-9"
                             :class="{'animate-tapesx': isPressed, 'animate-stop':!isPressed}" :style="{'--animation-duration': minuteRelax + 's', '--elapsed-time': minuteRelax-mRelax + 's', 'animation-play-state': isPressed ? 'paused':'running'}"></span>
                    </div>
                </div>
                <div class="absolute right-3 top-1/2 -translate-y-1/2">
                    <img class="h-9 sm:h-10" src="@/images/rotella.png" alt="wheel" :class="{'animate-spin':isPressed}">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary h-5 w-5 sm:h-6 sm:w-6">
                        <img src="@/images/provap.png" alt="wheelWheel" :class="{'animate-spin':isPressed}">
                        <span v-if="timeStudy" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-black h-9 w-9"
                             :class="{'animate-tapedx': isPressed, 'animate-stop':!isPressed}" :style="{'--animation-duration': minuteStudy + 's', '--elapsed-time': minuteStudy-mStudy + 's', 'animation-play-state': isPressed ? 'paused':'running'}"></span>
                        <span v-else class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-black h-9 w-9"
                             :class="{'animate-tapedx': isPressed, 'animate-stop':!isPressed}" :style="{'--animation-duration': minuteRelax + 's', '--elapsed-time': minuteRelax-mRelax + 's', 'animation-play-state': isPressed ? 'paused':'running'}"></span>
                    </div>
                </div>
            </div>
            <span class="absolute text-2xl font-bold bottom-6 left-1/9 text-secondary">A</span>
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

            <div class="absolute left-1/2 -translate-x-1/2 -bottom-8 h-2 w-full">
                <div v-if="timeStudy" class="h-full bg-secondary w-0" :class="{'animate-loading': isPressed, 'animate-stop': !isPressed}"
                :style="{'--animation-duration': minuteStudy + 's', '--elapsed-time': minuteStudy-mStudy + 's', 'animation-play-state': isPressed ? 'paused':'running'}"></div>
                <div v-else class="h-full bg-white w-0" :class="{'animate-loading': isPressed, 'animate-stop': !isPressed}"
                :style="{'--animation-duration': minuteRelax + 's', '--elapsed-time': minuteRelax-mRelax + 's', 'animation-play-state': isPressed ? 'paused':'running'}"></div>
            </div>

            <button @click="startTimer" class="absolute left-1/2 -translate-x-1/2 -bottom-24 max-w-40 min-w-36 
                                               py-1 rounded-2xl transition-all w-1/3 font-semibold text-2xl bg-fifth text-secondary" 
                                       :class="{'transform translate-y-1': isPressed, 'border-b-4 border-white':!isPressed}">
                {{ buttonText }}
            </button>

        </div>    
    </div>

    <div class="relative">
        <div class="absolute top-1/2 left-1/2 -translate-y-2/3 -translate-x-1/2 h-1/3 w-1/4 max-w-80 rounded-2xl min-w-40 border-4 border-fifth
                    md:right-10 md:left-auto md:translate-x-0">
            <iframe class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-full w-full rounded-xl" src="https://www.youtube.com/embed/jfKfPfyJRdk?si=GcaboFudiu7ISCG4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>

    </div>
  </div>
    <!--Options Menu-->
    <Modal v-show="showMenu" @click.self="showOptionsMenu">
        <div class="overflow-scroll max-h-96">
            <label for="">Total Time
                <input type="number" class="w-full px-1 mt-1" placeholder="enter the minutes" v-model="minutesNumber">
            </label>
            <div class="flex justify-center">
                <button class="bg-secondary mt-3 text-white font-semibold rounded-xl p-2" @click="validNumber">
                    Possible cycles
                </button>
            </div>
            <div class="mt-2" v-for="(cicle,index) in cicles" :key="index">
                <div @click="saveCicle(index)" class="w-full text-white bg-secondary p-2 my-1 rounded-lg">
                    Study: {{ cicle.study }} minutes <br>
                    Relax: {{cicle.relax}} minutes <br>
                    Cicle: {{cicle.ncicle}}
                </div>

            </div>
        </div>
    </Modal>
  
</template>


<script>
import {ref, onMounted} from 'vue'
import Modal from "@/components/Modal.vue";


export default {

    components:{
        Modal
    },

    setup(){

        const cicles = ref([
            {
                relax: 5,
                ncicle: 5,
                study: 30
            }
        ])

        const audio = new Audio("/soundbutton.mp3")
        const buttonText = ref("START")
        const minutes = ref()
        const time = ref()
        let interval
        const numCicli = ref(5)
        const minuteStudy = ref(1800)
        const minuteRelax = ref(300)
        const mstudy = ref()

        const mRelax = ref()
        const mStudy = ref()
        const nCicle = ref()

        onMounted(() => {
            nCicle.value = numCicli.value
            mStudy.value = minuteStudy.value
            time.value = formatTime(minuteStudy.value)
        })

        const saveCicle = (index) => {
            showMenu.value = false
            numCicli.value = cicles.value[index].ncicle
            minuteRelax.value = (cicles.value[index].relax)*60
            minuteStudy.value = (cicles.value[index].study)*60
            mRelax.value = (cicles.value[index].relax)*60
            mStudy.value = (cicles.value[index].study)*60
            time.value = formatTime(minuteStudy.value)
            nCicle.value = cicles.value[index].ncicle
            timeStudy.value = true
            console.log(minuteRelax.value)
            console.log(minuteStudy.value)
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
                                buttonText.value = "START"
                                timeStudy.value = false
                                mRelax.value = minuteRelax.value
                                time.value = formatTime(mRelax.value)
                            }
                        }, 1000)
                        console.log(nCicle.value)
                    }else{
                        buttonText.value = "START"
                        clearInterval(interval)
                    }       
                }else{
                    if(isPressed.value === true){
                        buttonText.value = "PAUSE"
                        interval = setInterval(() => {
                            mRelax.value--
                            time.value = formatTime(mRelax.value)
                            if(mRelax.value === 0 && nCicle.value === 1){
                                isPressed.value = false
                                audio.play()
                                clearInterval(interval)
                                buttonText.value = "START"
                                timeStudy.value = true
                                time.value = 8888
                            }
                            else if(mRelax.value === 0){
                                isPressed.value = false
                                audio.play()
                                clearInterval(interval)
                                buttonText.value = "START"
                                timeStudy.value = true
                                mStudy.value = minuteStudy.value
                                nCicle.value--
                                time.value = formatTime(mStudy.value)
                            }
                        }, 1000)
                    }else{
                        buttonText.value = "START"
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
            console.log(numCicli.value)
            nCicle.value = numCicli.value
            mStudy.value = minuteStudy.value
            mRelax.value = minuteRelax.value
            timeStudy.value = true
            isPressed.value = false
            clearInterval(interval)
            time.value = formatTime(minuteStudy.value)
        }

        const finishCicle = () => {
            isPressed.value = false
            audio.play()
            clearInterval(interval)
            buttonText.value = "START"
            timeStudy.value = true
            time.value = 8888    
        }

        const skipCicle = () => {
            if(timeStudy.value === true){
                isPressed.value = false
                audio.play()
                clearInterval(interval)
                buttonText.value = "START"
                timeStudy.value = false
                mRelax.value = minuteRelax.value
                time.value = formatTime(mRelax.value)    

            }else if(timeStudy.value === false && nCicle.value === 1){
                isPressed.value = false
                audio.play()
                clearInterval(interval)
                buttonText.value = "START"
                timeStudy.value = true
                mStudy.value = minuteStudy.value
                nCicle.value--
                time.value = 8888

            }else{
                isPressed.value = false
                audio.play()
                clearInterval(interval)
                buttonText.value = "START"
                timeStudy.value = true
                mStudy.value = minuteStudy.value
                nCicle.value--
                time.value = formatTime(mStudy.value)
            }
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
            skipCicle
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
    0% {
        width: 0%;
    }
    100% {
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