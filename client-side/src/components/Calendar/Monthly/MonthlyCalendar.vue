<template>
    <!-- Monthly date picker -->
    <div class="text-center sm:text-left">
        <DatePicker class="inline-block mt-3 sm:ml-8 w-auto" v-model="monthSelected" month-picker :enable-time-picker="false"></DatePicker>
    </div>

    <div id="monthly_calendar_container" class="grid grid-cols-7 mt-4">
        <!-- Header -->
        <div class="hidden sm:block text-center bg-secondary text-white font-semibold border-t border-black">Monday</div>
        <div class="block sm:hidden text-center bg-secondary text-white font-semibold border-t border-black">M</div>
        <div class="hidden sm:block text-center bg-secondary text-white font-semibold border-t border-black">Tuesday</div>
        <div class="block sm:hidden text-center bg-secondary text-white font-semibold border-t border-black">T</div>
        <div class="hidden sm:block text-center bg-secondary text-white font-semibold border-t border-black">Wednesday</div>
        <div class="block sm:hidden text-center bg-secondary text-white font-semibold border-t border-black">W</div>
        <div class="hidden sm:block text-center bg-secondary text-white font-semibold border-t border-black">Thursday</div>
        <div class="block sm:hidden text-center bg-secondary text-white font-semibold border-t border-black">T</div>
        <div class="hidden sm:block text-center bg-secondary text-white font-semibold border-t border-black">Friday</div>
        <div class="block sm:hidden text-center bg-secondary text-white font-semibold border-t border-black">F</div>
        <div class="hidden sm:block text-center bg-secondary text-white font-semibold border-t border-black">Saturday</div>
        <div class="block sm:hidden text-center bg-secondary text-white font-semibold border-t border-black">S</div>
        <div class="hidden sm:block text-center bg-secondary text-white font-semibold border-t border-black">Sunday</div>
        <div class="block sm:hidden text-center bg-secondary text-white font-semibold border-t border-black">S</div>

        <!--
        <div class="min-h-20 text-center border-t border-r border-black col-start-4">prova</div>
        <div class="min-h-20 text-center border-t border-r border-black">test</div>
    -->

        <div v-for="(date, index) in daysArray" :key="index" :class="getDynamicDayClass(date, index)" class="min-h-20 text-white border-b border-black border-r text-center border-r">
            <div class="bg-secondary"> {{ date.getDate() }}</div>
        </div>
        
        <!-- TODO: v-for giorni del mese probabilmente? -->
        <!-- Days -->
         <!--
        <div class="min-h-20 text-center border-t border-r border-black">30</div>
        <div class="min-h-20 text-center border-t border-r border-black">
            1ott
            <div class="text-center bg-red-500 mt-px">prova</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
        </div>
        <div class="min-h-20 text-center border-t border-r border-black">2</div>
        <div class="min-h-20 text-center border-t border-r border-black">3</div>
        <div class="min-h-20 text-center border-t border-r border-black">4</div>
        <div class="min-h-20 text-center border-t border-r border-black">
            5
            <div class="text-center bg-red-500">prova</div>
        </div>
        <div class="min-h-20 text-center border-t border-r border-black">6</div>
        <div class="min-h-20 text-center border-t border-r border-black">7</div>
        <div class="min-h-20 text-center border-t border-r border-black">8</div>
        <div class="min-h-20 text-center border-t border-r border-black">
            9
            <div class="text-center bg-red-500">prova</div>
        </div>
        <div class="min-h-20 text-center border-t border-r border-black">10</div>
        <div class="min-h-20 text-center border-t border-r border-black">11</div>
        <div class="min-h-20 text-center border-t border-r border-black">12</div>
        <div class="min-h-20 text-center border-t border-r border-black">13</div>
        <div class="min-h-20 text-center border-t border-r border-black">14</div>
        <div class="min-h-20 text-center border-t border-r border-black">15</div>
        <div class="min-h-20 text-center border-t border-r border-black">16</div>
        <div class="min-h-20 text-center border-t border-r border-black">17</div>
        <div class="min-h-20 text-center border-t border-r border-black">18</div>
        <div class="min-h-20 text-center border-t border-r border-black">19</div>
        <div class="min-h-20 text-center border-t border-r border-black">20</div>
        <div class="min-h-20 text-center border-t border-r border-black">21</div>
        <div class="min-h-20 text-center border-t border-r border-black">22</div>
        <div class="min-h-20 text-center border-t border-r border-black">23</div>
        <div class="min-h-20 text-center border-t border-r border-black">24</div>
        <div class="min-h-20 text-center border-t border-r border-black">25</div>
        <div class="min-h-20 text-center border-t border-r border-black">26</div>
        <div class="min-h-20 text-center border-t border-r border-black">27
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
        </div>
        <div class="min-h-20 text-center border-t border-b border-r border-black">28</div>
        <div class="min-h-20 text-center border-t border-b border-r border-black">29</div>
        <div class="min-h-20 text-center border-t border-b border-r border-black">30</div>
        <div class="min-h-20 text-center border-t border-b border-r border-black">31</div>
        <div class="min-h-20 text-center border-t border-b border-r border-black">
            1nov
            <div class="text-center bg-red-500">prova</div>
        </div>
        <div class="min-h-20 text-center border-t border-b border-r border-black">2</div>
        <div class="min-h-20 text-center border-t border-b border-r border-black">
            3
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
        </div>
    -->
    </div>
</template>

<script>
import { onMounted } from 'vue'
import DatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ref } from 'vue'
import { watch } from 'vue'
import { renderEvents } from './render-events-month.js'

export default {
    components : {
        DatePicker
    },
    setup() {
        // object containing field month and field year
        const monthSelected = ref({"month": new Date().getMonth(), "year": new Date().getFullYear()});
        watch(monthSelected, () => {
            updateDays()
            updateEvents()
        })

        const getDynamicDayClass = (date, index) => {
            return {
                [`grid-col-start-${date.getDay()===0 ? 7 : date.getDay()}`]: index===0, // set starting grid col
                'border-left': index===0
            };
        };

        const daysArray = ref([])
        const firstDayOfMonth = ref()
        const lastDayOfMonth = ref()
        const updateDays = () => {
            firstDayOfMonth.value = new Date(monthSelected.value.year, monthSelected.value.month, 1)
            lastDayOfMonth.value = new Date(monthSelected.value.year, monthSelected.value.month+1, 0)
            // Loop through each day of the month and add to daysArray
            daysArray.value = []
            for (let day = 1; day <= lastDayOfMonth.value.getDate(); day++) {
                // Push a new Date object for each day into the array
                daysArray.value.push(new Date(monthSelected.value.year, monthSelected.value.month, day));
            }
            console.log(daysArray.value);
        }

        const events = ref()
        const updateEvents = () => {
            // first and last days of the month, use this for event find
            // console.log(new Date(monthSelected.value.year, monthSelected.value.month, 1))   
            // console.log(new Date(monthSelected.value.year, monthSelected.value.month+1, 0))
        }
        // lifecycle hooks
        //set calendar to occupy at least the size of the viewport
        onMounted(() => {
            const calendarContainer = document.getElementById("monthly_calendar_container")
            const top = calendarContainer.getBoundingClientRect().top
            const remainingHeight = window.innerHeight - top    // window.innerHeight is the height of the viewport
            // set monthly calendar grid to take up the remaining vertical space of the viewport
            calendarContainer.style.minHeight = `${remainingHeight}px`

            renderEvents();
        })
        
        return {
            monthSelected,
            daysArray,
            getDynamicDayClass
        }
    }
}
</script>

<style scoped>
    /* these classes are needed because tailwind doesn't recognize vue's dynamically generated classes */
    .grid-col-start-1 {
        grid-column-start: 1;
    }

    .grid-col-start-2 {
        grid-column-start: 2;
    }

    .grid-col-start-3 {
        grid-column-start: 3;
    }

    .grid-col-start-4 {
        grid-column-start: 4;
    }

    .grid-col-start-5 {
        grid-column-start: 5;
    }

    .grid-col-start-6 {
        grid-column-start: 6;
    }

    .grid-col-start-7 {
        grid-column-start: 7;
    }

    .border-left {
        border-left-width: 1px;
    }

    
</style>