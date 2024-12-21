import express from 'express';
import calendarRoutes from './routes/calendarRoutes.js'
import loginRoutes from './routes/loginRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import http from "node:http";
import mongoose from 'mongoose';
import {wsHandler} from "./ws/wsHandler.js";
import noteRoutes from './routes/noteRoutes.js'
//import categoryRoutes from './routes/categoryRoutes.js'
import chatRoutes from './routes/chatRoutes.js'

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

//TODO: set up env variables for mongo uri parameters
const mongouri = `mongodb+srv://bencio003:74TG73rgjIbrzp4Q@tecweb18.wgvir.mongodb.net/tw18_db?retryWrites=true&w=majority&appName=Tecweb18`

mongoose.connect(mongouri)
    .then(() => {
    console.log("Connection to DB successful")
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

// routing
app.use("/api/calendar", calendarRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/note", noteRoutes)
//app.use("/api/category", categoryRoutes)
app.use("/api/chat", chatRoutes)

//https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

export const wsConnectionHandler = new wsHandler({ server });

// start server
server.listen(PORT, () => {
    console.log("Server is running")
});