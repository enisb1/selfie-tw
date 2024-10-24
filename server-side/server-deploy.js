import express from 'express';
import homeRouter from './routes/homeRoutes.js';
import notesRouter from './routes/notesRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import http from "node:http";

const app = express();
const PORT = 8000;

app.use(cors());

//https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // get name of the directory
// Serve static files from the client-side/dist directory
const client_dist_path = __dirname + '/../client-side/dist'; // build directory
app.use(express.static(client_dist_path));  //middleware to serve static build dist for any path

// routing
app.use("/", homeRouter);
app.use("/notes", notesRouter);

// Create an HTTP server and attach the Express app
const server = http.createServer(app);

// start server
server.listen(PORT);