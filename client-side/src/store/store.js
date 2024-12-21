import { createStore } from 'vuex';
import {wsService} from '@/ws/wsService';

export const store = createStore({

    state: {
        _id: '',
        username: '',
        passwordHash: '',
        email: '',
        firstName: '',
        lastName: '',
        isAResource: false,
        isAdmin: false,
        telegram: '',
        __v: 0,
        isLoggedIn: false,
        pushNotification: null,
        chatMessage: null,
        ws: null,
        unavailableStart: null,
        unavailableEnd: null,
        unavailableFrequency: 'none',
        unavailableRepNumber: null,
        unavailableRepDate: null
    },
    getters: {

    },
    mutations: {
        setUser(state, user) {
            state._id = user._id;
            state.username = user.username;
            state.passwordHash = user.passwordHash;
            state.email = user.email;
            state.firstName = user.firstName;
            state.lastName = user.lastName;
            state.isAResource = user.isAResource;
            state.isAdmin = user.isAdmin;
            state.telegram = user.telegram;
            state.__v = user.__v;
            state.isLoggedIn = true;
            state.unavailableStart = user.unavailableStart;
            state.unavailableEnd = user.unavailableEnd;
            state.unavailableFrequency = user.unavailableFrequency;
            state.unavailableRepNumber = user.unavailableRepNumber;
            state.unavailableRepDate = user.unavailableRepDate;
        },
        flushUser(state) {
            state._id = '';
            state.username = '';
            state.passwordHash = '';
            state.email = '';
            state.firstName = '';
            state.lastName = '';
            state.isAResource = false;
            state.isAdmin = false;
            state.telegram = '';
            state.__v = 0;
            state.isLoggedIn = false;
            state.unavailableStart = null;
            state.unavailableEnd = null;
            state.unavailableFrequency = 'none';
            state.unavailableRepNumber = null;
            state.unavailableRepDate = null;
        },
        initializeStore(state) {
            if (localStorage.getItem('username')) {
                state._id = localStorage.getItem('_id');
                state.username = localStorage.getItem('username');
                state.passwordHash = localStorage.getItem('passwordHash');
                state.email = localStorage.getItem('email');
                state.firstName = localStorage.getItem('firstName');
                state.lastName = localStorage.getItem('lastName');
                state.isAResource = localStorage.getItem('isAResource');
                state.isAdmin = localStorage.getItem('isAdmin');
                state.telegram = localStorage.getItem('telegram');
                state.__v = localStorage.getItem('__v');
                state.isLoggedIn = localStorage.getItem('isLoggedIn');
                state.pushNotification = localStorage.getItem('pushNotification');
                state.chatMessage = localStorage.getItem('chatMessage');
                state.unavailableStart = localStorage.getItem('unavailableStart');
                state.unavailableEnd = localStorage.getItem('unavailableEnd');
                state.unavailableFrequency = localStorage.getItem('unavailableFrequency');
                state.unavailableRepNumber = localStorage.getItem('unavailableRepNumber');
                state.unavailableRepDate = localStorage.getItem('unavailableRepDate');
            }
        },
        addPushNotification(state, notification) {
            state.pushNotification = notification;
        },
        addChatMessage(state, message) {
            state.chatMessage = message;
        },
        connect(){
            if(!this.ws && this.state.isLoggedIn){
                wsService.connect(this);
                this.ws = wsService;
            }

        },
        disconnect(){
            if(this.ws){
                wsService.disconnect();
                this.ws = null;
            }
        },
        setUnavailableStart(state, value) {
            state.unavailableStart = value;
        },
        setUnavailableEnd(state, value) {
            state.unavailableEnd = value;
        },
        setUnavailableFrequency(state, value) {
            state.unavailableFrequency = value;
        },
        setUnavailableRepNumber(state, value) {
            state.unavailableRepNumber = value;
        },
        setUnavailableRepDate(state, value) {
            state.unavailableRepDate = value;
        }
    },
    actions: {

    },
    modules: {

    }
});



