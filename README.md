## Dates and MongoDB
MongoDB stores dates in UTC timezone (GMT).\
Dates are sent back to client in local timezone.

### Dates and Axios
Axios doesn't correctly transform Date objects into strings, in fact the local time zone info is lost through the api call, this means that server-side the received date string is going to be interpreted as UTC by default.\
In order to tackle this problem, when making comparisons with dates from db(for example when getting events between certain startDate and endDate), first they need to be converted to UTC and then sent to the server through the api call using axios

### Activities
Activities are displayed differently in the calendar.\
In all types of calendars, in calendar view, the activity has the same 'crimson' red color. In the daily and weekly calendar, the activity deadline also has a rectangular border to distinguish it from the events.\
The distinction is present also in list view, here the activities are displayed first, before the events, with the same bright 'crimson' red color.

### Schedules
The schedules are events/activities, schedules is a name we came up to identify both

### Run tailwind
nagivate to client side folder\
npx tailwindcss -i "src/styles/tailwind.css" -o "src/styles/output.css" --watch\
if you don't want to --watch:\
npx tailwindcss build -i "./src/styles/tailwind.css" -o "src/styles/output.css"\
copy output file in public directory in order to serve it to client when accessing projects.html, or run same command with output.css in public folder

### Activities' possible status
• waitingActivable (non è ancora disponibile l'input relativo)\
• activable (ma non attivata: l'input è presente ma l'attore non ha
ancora dichiarato di averla iniziata) (status goes from waitingActivable to activable when previous activity
finishes)\
• active (l'attore ha dichiarato di averla iniziata)\
• reactivated (il capo-progetto ha rifiutato l'output e ha richiesto revisioni)\
• overdue (la data di conclusione è passata ma l'output non è ancora
disponibile)\
• done (l'attore ha dichiarato di averla conclusa ed un output è
disponbile)\
• discarded (la data di conclusione è passata da molto tempo,
oppure l'attore ha dichiarato di non volersene più occupare)\