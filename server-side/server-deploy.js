import express from 'express';
import calendarRoutes from './routes/calendarRoutes.js'
import loginRoutes from './routes/loginRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import http from "node:http";
import mongoose from 'mongoose';
import {wsHandler} from "./services/wsHandler.js";
import noteRoutes from './routes/noteRoutes.js'
import pomodoroRoutes from './routes/pomodoroRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import {AgendaHandler} from "./services/agendaHandler.js";
import {Mailer} from "./services/mailer.js";
import {TimeMachineController} from "./services/timeMachine.js";
import timeRoutes from './routes/timeMachineRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import dotenv from 'dotenv'

// __dirname is not defined in es modules but only in commonjs
// so this is needed in order to use it
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const mongouri = process.env.MONGO_URI

mongoose.connect(mongouri)
    .then(() => {
    console.log("Connection to DB successful")
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

export const agendaHandler = new AgendaHandler(mongouri);

await agendaHandler.start();
await agendaHandler.defineJobs();

process.on('SIGTERM', async () => {
    await agendaHandler.stop();
    process.exit(0);
});

process.on('SIGINT', async () => {
    await agendaHandler.stop();
    process.exit(0);
});


// routing
app.use("/api/calendar", calendarRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/note", noteRoutes)
app.use("/api/pomodoro", pomodoroRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/time", timeRoutes)
app.use("/api/projects", projectRoutes)

// Serve static files from the client-side/dist directory
const client_dist_path = __dirname + '/../client-side/dist';
app.use(express.static(client_dist_path)); // serve static files to make those resources accessible to index.html
// for any request received by the server, respond with the static file index.html
// (vue router will handle the front-end routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client-side/dist' + '/index.html'));
});

// Create an HTTP server and attach the Express app
const server = http.createServer(app);

export const mailer = new Mailer();

// Create a WebSocket server
export const wsConnectionHandler = new wsHandler({ server });

export const timeMachineController = new TimeMachineController();


// start server
server.listen(PORT, () => {
    console.log("Server is running")
});
