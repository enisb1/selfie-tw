import {useStore} from "vuex";


export class Message {
    constructor(from, to, type, data) {
        this.from = from;
        this.to = to;
        this.type = type;
        this.data = data;
    }
}

export class WebSocketService {

    connect(store) {
        this.store = store;
        console.log("connecting "+this.store.state.username);
        this.socket = new WebSocket(`ws://localhost:8000/?username=${this.store.state.username}`);
        this.socket.onmessage = this.handleMessage.bind(this);
        this.socket.onclose = this.disconnect.bind(this);
    }



    disconnect() {
        if (this.socket) {
            this.socket.close();
            console.log("disconnecting "+this.store.state.username);
            this.store.state.ws = null;
            this.socket = null;
        }
    }

    sendMessage(type, data) {
        if (!this.socket) {
            this.connect( this.store.state.username );
        }
        if (this.socket) {
            this.socket.send(JSON.stringify( new Message(this.store.state.username, 'server', type, data) ));
        }
    }

    async handleMessage(event) {
        const parsedMessage = JSON.parse(event.data);
        console.log("é arrivato un nuovo messaggio",parsedMessage);
        switch (parsedMessage.type) {
            case 'notification':
                this.addNotification(parsedMessage.data);
                break;
            case 'chat':
                this.addChatMessage(parsedMessage.data);
                break;
            default:
                this.sendMessage('error', 'Invalid message type');

        }
    }

    addNotification(data) {
        this.store.commit('addPushNotification', data);
    }

    addChatMessage(data) {
        this.store.commit('addChatMessage', data);

    }
}

export const wsService = new WebSocketService();


