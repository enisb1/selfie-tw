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
nagivate to client side folder
npx tailwindcss -i "src/styles/tailwind.css" -o "src/styles/output.css" --watch