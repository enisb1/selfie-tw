<template>
    <div id="weekly_calendar_container" class="grid overflow-x-scroll">
        <div id="week_calendar_header">
            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Monday</div>
                <div>01</div>
            </div>
            
            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Tuesday</div>
                <div>02</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Wednesday</div>
                <div>03</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Thursday</div>
                <div>04</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Friday</div>
                <div>05</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Saturday</div>
                <div>06</div>
            </div>

            <div class="week_header_day bg-secondary text-white min-w-24">
                <div>Sunday</div>
                <div>07</div>
            </div>
        </div>

        <div id="timeslots_container" class="text-left">
            <div class="timeslot bg-secondary min-h-16 text-white">
                00:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                01:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                02:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                03:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                04:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                05:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                06:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                07:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                08:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                09:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                10:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                11:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                12:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                13:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                14:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                15:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                16:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                17:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                18:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                19:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                20:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                21:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                22:00
            </div>
            <div class="timeslot bg-secondary min-h-16 text-white">
                23:00
            </div>
        </div>

        <div id="events_container">
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
    #weekly_calendar_container {
        grid-template-columns: 4rem auto;
        grid-template-rows:auto;
        grid-template-areas:
        ". header"
        "timeslots-container main";
        margin-top: 1rem;
    }

    .week_header_day {
        border-left: 0.1rem solid black;
        border-top: 0.1rem solid black;
    }

    #week_calendar_header {
        grid-area: header;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    #timeslots_container {
        grid-area: timeslots-container;
    }

    .timeslot::after {
        content: '';
        position: absolute;
        left: 0px;
        width: 100%;
        height: 0.1rem;
        background: black;
    }

    #events_container {
        grid-area: main;
        display: grid;
        white-space: nowrap;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(288, 1fr);
        position: relative; /*devo settare una position perché i figli con position absolute si allacciano al
                            padre più prossimo che ha la position settata a qualcosa diverso da static(default)*/
        /* vertical lines */
        background: repeating-linear-gradient(
        to right,
        transparent 0%,
        transparent 14.2%,
        gray 14.3%
    );
    }

    .event_box1 {
        grid-column: 2 / span 1;
        grid-row: 37;
        width: 100%;
        left: 0%;
        background-color: blue;
        position: absolute;
    }
</style>