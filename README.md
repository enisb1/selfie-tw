# Selfie

## Contents
- [Description](#description)
- [Project Structure and Used Technologies](#project-structure-and-used-technologies)
- [Some of the libraries we have used](#some-of-the-libraries-we-have-used)
- [AI usage](#ai-usage)
- [Contributors](#contributors)
- [Setup development](#setup-development)

## Description
Selfie is a comprehensive web application designed to support university students in managing their academic and personal lives effectively. Developed as a final project for the Web Technologies course at the University of Bologna,
Selfie integrates calendar-based event scheduling, note-taking, productivity tracking via the Pomodoro technique, and advanced project management tools within a single responsive interface.

The project is structured as a full-stack application, built with a client-server architecture using Vue.js, vanilla JavaScript, Node.js, and MongoDB, and deployed via Docker containers on university servers.

Key features of the project include:
- **Home View**: Contains a preview of the main views of the website: Calendar, Projects, Pomodoro, Notes.
- **Calendar View**: Manage personal and shared events, and also activities with deadlines. All of this with flexible repetition
rules and rich notifications.
- **Admin View**: Manage resources creation and deletion.
- **Notes View**: Create and share notes (normal or markdown) and tasklists.
- **Pomodoro View**: Use the Pomodoro study technique with customizable timers, visual feedback and sound.
- **Projects Management**: Plan and track complex multi-user projects, with a list and Gantt visualization.
- **Chat System**: Communicate with all users in real-time (through a hub or through a private message).
- **Notification System**: Receive real-time notifications for events, tasks, messages, pomodoro configurations from other 
users and invites (for events, activities or projects).
- **Time Machine**: A unique feature to simulate different dates and times, enabling immediate feedback on scheduling and 
notifications in the case of the project's presentation.

## Project Structure and Used Technologies
The project is organized in two main folders:

### Client-Side

```plaintext
client-side/
├── public/
│   ├── index.html
│   ├── projects.js
|   ├── projects.html
|   ├── ...
├── src/
│   ├── apis/
│   ├── components/
│   ├── images/
│   ├── router/
│   ├── store/
│   ├── styles/
│   ├── views/
│   ├── ws/
│   ├── App.vue
│   ├── main.js
├── package.json
├── package-lock.json
├── tailwind.config.js
├── ..
```

The client-side provides a responsive and modular interface optimized for both desktop and mobile usage. It includes reusable components, routing via Vue Router, and state
management via Vuex. Each main view corresponds to a core feature of the application, such as Calendar, Notes, Pomodoro.
Most of the client-side has been developed using Vue.js, while the Projects Management section has been developed using only Vanilla JS.
Tailwind has been used as a CSS framework to provide a clean and slick UI.

### Server-Side

```plaintext
server-side/
├── models/
│   ├── Activity.js
│   ├── Note.js
│   ├── ...
├── routes/
│   ├── calendarRoutes.js
│   ├── noteRoutes.js
├── services/
│   ├── agendaHandler.js
│   ├── mailer.js
│   ├── ...
├── server-deploy.js
├── .env.local
├── package.json
├── package-lock.json
```
The backend uses Node.js, Express and Mongoose to handle user authentication, data management, and communication with 
a MongoDB database. Express is used to route API calls and Mongoose models are used for schema-based data 
representation. 

## Some of the libraries we have used

- **mongoose**: Mongoose is an Object Data Modeling (ODM) library for MongoDB that is used for interacting with the database.
- **ws**: ws is a WebSocket library for Node.js that is used for handling WebSocket connections.
- **agenda**: Agenda is a job scheduling library for Node.js that is used for scheduling the tasks and events notifications of the users.
- **fake-timers**: Fake Timers is a library that is used for mocking timers. We used it for the time machine.
- **nodemailer**: Nodemailer is a library used for sending emails to the users.
- **bcrypt**: Bcrypt is a library used for hashing passwords.
- **axios**: Axios is a promise-based HTTP client for the browser and Node.js. It is used for making HTTP requests to the server.
- **express**: Express is a web application framework for Node.js. It is used to handle routing in the server-side of the application.
- **vuex**: Vuex is a state management pattern + library for Vue.js applications. It is used for managing the state of the application.

## AI usage
Some of the members of the group have used Github Copilot as an assistant.
In particular, they started using it around mid development, to facilitate and speed up the development process.
It helped with code completion and with repetitive tasks such as HTTP requests.
Of course, AI has not been of much use with tasks that had to do with the intrinsic complication of the project, due to its difficulty in understanding the project's logic

## Contributors

- **Brajevic Enis**:
  - calendar (management of events and activities)
  - admin (management of resources)
  - projects
  - server setup and deploy
  - home view (preview of calendar and projects)
- **Mazzotti Enrico**
  - user authentication
  - notification system
  - chat system
  - time machine
- **Orsi Cristian**
  - projects (Gantt chart)
  - pomodoro
  - notes and tasklists
  - home view (preview of pomodoro and notes)

## Setup development
To install the project, follow these steps:
1. Clone the repository:  
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies for the frontend:  
   ```bash
    cd client-side
    npm install
    ```
3. Install dependencies for the backend:

    ```bash
     cd ../server-side
     npm install
     ```
4. Start the backend server:
    ```bash
   npm start
   ```
5. Start the frontend development server:
   ```bash
    cd ../client-side
    npm run serve
    ```
6. Open your browser and navigate to `http://localhost:8080` to view the application.









