<template>
    <div id="monthly_calendar_container" class="grid grid-cols-7 mt-4">
        <!-- Header -->
        <div class="hidden sm:block text-center border-t">Monday</div>
        <div class="block sm:hidden text-center border-t">M</div>
        <div class="hidden sm:block text-center border-t">Tuesday</div>
        <div class="block sm:hidden text-center border-t">T</div>
        <div class="hidden sm:block text-center border-t">Wednesday</div>
        <div class="block sm:hidden text-center border-t">W</div>
        <div class="hidden sm:block text-center border-t">Thursday</div>
        <div class="block sm:hidden text-center border-t">T</div>
        <div class="hidden sm:block text-center border-t">Friday</div>
        <div class="block sm:hidden text-center border-t">F</div>
        <div class="hidden sm:block text-center border-t">Saturday</div>
        <div class="block sm:hidden text-center border-t">S</div>
        <div class="hidden sm:block text-center border-t">Sunday</div>
        <div class="block sm:hidden text-center border-t">S</div>
        
        <!-- TODO: v-for giorni del mese probabilmente? -->
        <!-- Days -->
        <div class="min-h-20 text-center border-t border-r">30</div>
        <div class="min-h-20 text-center border-t border-r">
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
        <div class="min-h-20 text-center border-t border-r">2</div>
        <div class="min-h-20 text-center border-t border-r">3</div>
        <div class="min-h-20 text-center border-t border-r">4</div>
        <div class="min-h-20 text-center border-t border-r">
            5
            <div class="text-center bg-red-500">prova</div>
        </div>
        <div class="min-h-20 text-center border-t border-r">6</div>
        <div class="min-h-20 text-center border-t border-r">7</div>
        <div class="min-h-20 text-center border-t border-r">8</div>
        <div class="min-h-20 text-center border-t border-r">
            9
            <div class="text-center bg-red-500">prova</div>
        </div>
        <div class="min-h-20 text-center border-t border-r">10</div>
        <div class="min-h-20 text-center border-t border-r">11</div>
        <div class="min-h-20 text-center border-t border-r">12</div>
        <div class="min-h-20 text-center border-t border-r">13</div>
        <div class="min-h-20 text-center border-t border-r">14</div>
        <div class="min-h-20 text-center border-t border-r">15</div>
        <div class="min-h-20 text-center border-t border-r">16</div>
        <div class="min-h-20 text-center border-t border-r">17</div>
        <div class="min-h-20 text-center border-t border-r">18</div>
        <div class="min-h-20 text-center border-t border-r">19</div>
        <div class="min-h-20 text-center border-t border-r">20</div>
        <div class="min-h-20 text-center border-t border-r">21</div>
        <div class="min-h-20 text-center border-t border-r">22</div>
        <div class="min-h-20 text-center border-t border-r">23</div>
        <div class="min-h-20 text-center border-t border-r">24</div>
        <div class="min-h-20 text-center border-t border-r">25</div>
        <div class="min-h-20 text-center border-t border-r">26</div>
        <div class="min-h-20 text-center border-t border-r">27
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
        </div>
        <div class="min-h-20 text-center border-t border-b border-r">28</div>
        <div class="min-h-20 text-center border-t border-b border-r">29</div>
        <div class="min-h-20 text-center border-t border-b border-r">30</div>
        <div class="min-h-20 text-center border-t border-b border-r">31</div>
        <div class="min-h-20 text-center border-t border-b border-r">
            1nov
            <div class="text-center bg-red-500">prova</div>
        </div>
        <div class="min-h-20 text-center border-t border-b border-r">2</div>
        <div class="min-h-20 text-center border-t border-b border-r">
            3
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
            <div class="text-center bg-red-500 mt-px">prova2</div>
        </div>
    </div>
</template>

<script>
export default {
    //set calendar to occupy at least the size of the viewport
    mounted() {
        const calendarContainer = document.getElementById("monthly_calendar_container");
        const top = calendarContainer.getBoundingClientRect().top;
        const remainingHeight = window.innerHeight - top;   // window.innerHeight is the height of the viewport
        // set monthly calendar grid to take up the remaining vertical space of the viewport
        calendarContainer.style.minHeight = `${remainingHeight}px`;
    }
}
</script>

<style>

</style>