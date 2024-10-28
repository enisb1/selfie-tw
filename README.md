## Dates and MongoDB
MongoDB stores dates in UTC format (GMT)\

### Dates and Axios
Axios doesn't correctly transform Date objects into strings, in fact the local time zone info is lost through the api call, this means that server-side the received date string is going to be interpreted as UTC by default.\
In order to tackle this problem, when making comparisons with dates from db(for example when getting events between certain startDate and endDate), first they need to be converted to UTC and then sent through the api call using axios.
