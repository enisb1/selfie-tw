import {WebSocket,WebSocketServer} from 'ws';

export class wsHandler{
    constructor(server){
        this.userConnections = new Map();
        this.wss = new WebSocketServer(server);
        this.wss.on('connection', (ws,req) => {
            const params = new URLSearchParams(req.url.split('?')[1]);
            const username = params.get('username');
            console.log(username+" Connected to server");
            this.handleConnection(ws, username);
        });
    }
    handleConnection(ws, username){
        const connections = this.userConnections.get(username) || [];
        connections.push(ws);
        this.userConnections.set(username, connections);
        ws.on('close', () => this.handleDisconnection(ws, username));
        ws.on('message', (message) => this.handleReceiveMessage(message, ws, username));
        ws.on('error', () => this.handleDisconnection(ws, username));
    }
    handleDisconnection(ws, username){
        const connections = this.userConnections.get(username) || [];
        console.log(username + " disconnected");
        const index = connections.indexOf(ws);
        if (index > -1) {
            connections.splice(index, 1);
        }
        if (connections.length === 0) {
            this.userConnections.delete(username);
        } else {
            this.userConnections.set(username, connections);
        }
    }
    handleReceiveMessage(message, ws, username){
        try {
            const parsedMessage = JSON.parse(message);
            switch (parsedMessage.type) {
                case '':
                    break;
                default:
                    ws.send(JSON.stringify(new Message('server', username, 'error', 'Invalid message type')));
            }
        } catch (error) {
            ws.send(JSON.stringify(new Message('server', username, 'error', 'Error parsing message')));
        }
    }
    handleSendMessage(message, ws, username){
        const connections = this.userConnections.get(username) || [];
        connections.forEach(connection => {
            connection.send(JSON.stringify(message));
        });
    }
    sendPushNotification(message){
        const connections = this.userConnections.get(message.to) || [];
        connections.forEach(connection => {
            connection.send(JSON.stringify(message));
        });
    }
}


export class Message {
    constructor(from, to, type, data) {
        this.from = from;
        this.to = to;
        this.type = type;
        this.data = data;
    }
}


/*
export const handleConnection = (ws, userConnections, username) => {
    const connections = userConnections.get(username) || [];
    connections.push(ws);
    userConnections.set(username, connections);

    ws.on('close', () => handleDisconnection(ws, userConnections, username));
    ws.on('message', (message) => handleReceiveMessage(message, ws, userConnections, username));
    ws.on('error', () => handleDisconnection(ws, userConnections, username));
};

const handleDisconnection = (ws, userConnections, username) => {
    const connections = userConnections.get(username) || [];
    console.log(username + " disconnected");
    const index = connections.indexOf(ws);
    if (index > -1) {
        connections.splice(index, 1);
    }
    if (connections.length === 0) {
        userConnections.delete(username);
    } else {
        userConnections.set(username, connections);
    }
};

const handleReceiveMessage = async (message, ws, userConnections, username) => {
    try {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
            case '':
                break;
            default:
                ws.send(JSON.stringify(new Message('server', username, 'error', 'Invalid message type')));
        }
    } catch (error) {
        ws.send(JSON.stringify(new Message('server', username, 'error', 'Error parsing message')));
    }
};

const handleSendMessage = (message, ws, userConnections, username) => {
    const connections = userConnections.get(username) || [];
    connections.forEach(connection => {
        connection.send(JSON.stringify(message));
    });
}



export const sendPushNotification = (message) => {
    const connections = userConnections.get(message.to) || [];
    connections.forEach(connection => {
        connection.send(JSON.stringify(message));
    });
}
*/
