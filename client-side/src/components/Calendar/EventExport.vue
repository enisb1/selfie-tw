<template>
    <div class="flex flex-col items-center">
        <h3 class="font-semibold text-lg text-secondary">EXPORT YOUR EVENT</h3>
        <div @click="downloadICal" class="cursor-pointer mt-2 flex justify-center items-center bg-white rounded-md border border-third w-3/4 sm:w-1/2 min-h-14">
            iCalendar File
        </div>
        <a :href="yahooLink" target="_blank" class="cursor-pointer mt-4 flex justify-center items-center bg-white rounded-md border border-third w-3/4 sm:w-1/2 min-h-14">
            Yahoo Calendar
        </a>
        <a :href="googleLink" target="_blank" class="cursor-pointer mt-4 flex justify-center items-center bg-white rounded-md border border-third w-3/4 sm:w-1/2 min-h-14">
            Google Calendar
        </a>
        <a :href="outlookLink" target="_blank" class="cursor-pointer mt-4 flex justify-center items-center bg-white rounded-md border border-third w-3/4 sm:w-1/2 min-h-14">
            Outlook Web Calendar
        </a>
        <div @click="sendToEmail" class="cursor-pointer mt-4 flex justify-center items-center bg-white rounded-md border border-third w-3/4 sm:w-1/2 min-h-14">
            Email
        </div>
    </div>
</template>

<script lang="js">
import { onMounted, ref } from 'vue'
import { getCalendarOptions, getICalendarAlarms } from './export-events';
import { ICalendar, GoogleCalendar, YahooCalendar, OutlookCalendar } from 'datebook';
import FileSaver from 'file-saver';
import { useStore } from 'vuex';
import { sendExportMail } from '@/apis/calendar';

export default {
    props: {
        event: Object
    },
    setup(props) {
        const store = useStore()

        const yahooLink = ref()
        const googleLink= ref()
        const outlookLink = ref()
        const iCalendarFile = ref()
        
        const downloadICal = () => {
            const blob = new Blob([iCalendarFile.value], { type: 'text/calendar' });
            FileSaver.saveAs(blob, `${props.event.title}.ics`);
        }
        
        const sendToEmail = async () => {
            const formData = new FormData();

            const blob = new Blob([iCalendarFile], { type: 'text/calendar' });
            formData.append('file', blob, `${props.event.title}.ics`);

            formData.append('receiver', store.state.email);
            formData.append('eventTitle', props.event.title);
            formData.append('yahooLink', yahooLink.value);
            formData.append('googleLink', googleLink.value);
            formData.append('outlookLink', outlookLink.value);

            await sendExportMail(formData)
        }

        onMounted(async () => {
            const iCalOptions = await getCalendarOptions(props.event, store.state._id)
            
            // render iCal
            const iCalAlarms = getICalendarAlarms(props.event)
            const iCal = new ICalendar(iCalOptions)
            for (const alarm of iCalAlarms) {
                iCal.addAlarm(alarm)
            }
            iCalendarFile.value = iCal.render()

            // render Yahoo Calendar
            yahooLink.value = new YahooCalendar(iCalOptions).render()

            // render Google
            googleLink.value = new GoogleCalendar(iCalOptions).render()

            // render Outlook Web Calendar
            outlookLink.value = new OutlookCalendar(iCalOptions).render()
        })

        return {
            iCalendarFile,
            yahooLink,
            googleLink,
            outlookLink,
            downloadICal,
            sendToEmail
        }
    }
}
</script>