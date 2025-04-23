# Selfie
## Description
Selfie is a comprehensive web application designed to support university students in managing their academic and
personal lives effectively. Developed as a final project for the Web Technologies course at the University of Bologna,
Selfie integrates calendar-based event scheduling, note-taking, productivity tracking via the Pomodoro technique, 
and advanced project management tools within a single responsive interface.

The project is structured as full-stack application, built with a client-server architecture using Vue.js,
vanilla JavaScript, Node.js, and MongoDB, and deployed via Docker containers on university servers.

Key features of the project include:
- Calendar System: Create, view, and manage personal and shared events, tasks, and deadlines with flexible repetition
rules and rich notifications.
- Notes Module: Take, organize, and share notes using Markdown with tagging and categorization.
- Pomodoro View: Implement the Pomodoro study technique with customizable timers, visual feedback and sound.
- Project Management: Plan and track complex multi-user projects using task hierarchies, dependencies, and Gantt charts.
- Chat System: Communicate with all users in real-time.
- Notification System: Receive real-time notifications for events, tasks, messages, pomodoro configurations from other 
users and invites (for events, activities or projects).
- Time Machine: A unique feature to simulate different dates and times, enabling immediate feedback on scheduling and 
notifications during presentations. 
## Project Structure
The project is organized as follows:
```plaintext
root/
├── client-side/
│   ├── public/
│   │   ├── index.html
│   │   ├── projects.js
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── App.vue
│   │   ├── main.js
│   ├── package.json
├── server-side/
│   ├── models/
│   │   ├── User.js
│   ├── routes/
│   │   ├── notifications.js
│   ├── server.js
│   ├── package.json
├── README.md
```
## Client-Side
The client-side of the application is developed using Vue.js, providing a responsive and modular interface optimized 
for both desktop and mobile usage. The frontend includes reusable components, routing via Vue Router, and state
management via vuex. Each main view corresponds to a core feature of the application, such as Calendar, Notes, Pomodoro,
and Project Management.

## Server-Side
The backend is built with Node.js and Express. It handles user authentication, data management, and communication with 
a MongoDB database. The server structure includes routes for each API endpoint and Mongoose models for schema-based data 
representation. 

## Libraries

- **mongoose**: Mongoose is an Object Data Modeling (ODM) library for MongoDB that is used for interacting with the database.
- **ws**: ws is a WebSocket library for Node.js that is used for handling WebSocket connections.
- **agenda**: Agenda is a job scheduling library for Node.js that is used for scheduling the tasks and events notifications of the users.
- **fake-timers**: Fake Timers is a library that is used for mocking timers. We mainly used it with the time machine.
- **nodemailer**: Nodemailer is a library used for sending emails to the users.
- **bcrypt**: Bcrypt is a library used for hashing passwords.
- **axios**: Axios is a promise-based HTTP client for the browser and Node.js. It is used for making HTTP requests to the server.
- **express**: Express is a web application framework for Node.js. It is used for building the server-side of the application.
- **vuex**: Vuex is a state management pattern + library for Vue.js applications. It is used for managing the state of the application.

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
   
## Contributors

- **Brajevic Enis**:
  - calendar events and activities
  - projects
  - admin management
  - deployment
- **Mazzotti Enrico**
  - user authentication
  - notification system
  - chat system
  - time machine
- **Orsi Cristian**
  - project Gantt chart
  - pomodoro
  - notes and tasks









