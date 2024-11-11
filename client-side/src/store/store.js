import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";

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
        isLoggedIn: false
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
            }
        }

    },
    actions: {

    },
    modules: {

    },
    plugins: [createPersistedState()],
});



