<template>

    <div class="bg-primary min-h-screen p-8 flex flex-col items-center">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-extrabold text-secondary mb-6">Notifications</h1>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-envelope-plus-fill text-secondary ml-4 mb-4" viewBox="0 0 16 16"  @click="openSendMessageModal">
          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 4.697v4.974A4.5 4.5 0 0 0 12.5 8a4.5 4.5 0 0 0-1.965.45l-.338-.207z"/>
          <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5"/>
        </svg>
      </div>
      <div v-if="notifications.length" class="space-y-6 w-full max-w-xl">
        <NotifyToggle 
          v-for="notification in notifications"
          :_id="notification._id"
          :sender="notification.sender"
          :type="notification.type"
          :title="notification.title"
          :text="notification.text"
          :time="notification.time"

          @remove="removeNotification(notification._id)"
          @open="openModal(notification._id)"
        />
      </div>
      <div v-else class="text-center text-secondary mt-8">
        <p>No new notifications</p>
      </div>
      
      <Modal v-if="showModal" @close="closeModal()">
        <span class="text-2xl font-semibold">{{ icon }}</span>
        <h1 class="text-2xl font-semibold text-secondary mb-6">{{selectedNotification.title}}</h1>
        <p class="text-secondary">{{ selectedNotification.text }}</p>
        <span class="text-xs text-third block m-1">{{ formatDate(new Date(selectedNotification.time)) }}</span>
        <button class="bg-third text-primary p-2 m-2 rounded-lg" v-if="selectedNotification.type==='message'" @click="openSendMessageModal" >Reply</button>
        <button
            @click="accept(selectedNotification.data.id,selectedNotification._id,selectedNotification.data.type)"
            v-if="selectedNotification.type === 'invite'"
            class="bg-green-700 text-primary p-2 m-2 rounded-lg"
        >Accept</button>

        <button
            @click="decline(selectedNotification._id)"
            v-if="selectedNotification.type === 'invite'"
            class="bg-red-600 text-primary p-2 m-2 rounded-lg"
        >Decline</button>

        <button
            class="bg-orange-500 text-primary rounded-lg  p-2 m-2 "
            v-if="selectedNotification.type === 'pomodoro'"
            @click="goToStudy(selectedNotification.data.minuteStudy, selectedNotification.data.minuteRelax, selectedNotification.data.numCycles)"
        >Study</button>
      </Modal>

      <Modal v-if="showSendMessageModal" @close="closeSendMessageModal()">
        <h1 class="text-2xl font-semibold text-secondary border- mb-6">Send message</h1>
        <select v-model="selectedRecipient" class="w-full p-2 border border-third rounded-lg mb-4">
        <option disabled value="">Select a receiver</option>
        <option v-for="recipient in recipients" :key="recipient.username" :value="recipient.username">
          {{ recipient.username }} [{{ recipient.firstName }} {{ recipient.lastName }}]
        </option>
      </select>
        <textarea v-model="text" class="w-full h-32 p-2 border border-third rounded-lg" placeholder="Write your message..."></textarea>
        <button class="bg-third text-primary p-2 m-2 rounded-lg" @click="sendMessage">Send</button>
      </Modal>

    </div>
    
  </template>
  
  <script>

  import Modal from '@/components/Modal.vue';
  import NotifyToggle from '@/components/Notifications/NotifyToggle.vue';
  import {computed, onMounted, ref, watchEffect} from 'vue';
  import {getAllUsers} from "@/apis/users";
  import user from "../../../server-side/models/User";
  import {
    acceptInvite,
    declineInvite,
    getNewNotifications,
    readNotification,
    sendNotification
  } from "@/apis/notifications";
  import {useStore} from "vuex";
  import router from "@/router";
  
  export default {
    name: "NotificationPage",
    computed: {
      user() {
        return user
      }
    },
    components: {
      NotifyToggle,
      Modal
    },
    setup() {
      const store = useStore();
      const selectedNotification = ref(null);
      const showModal = ref(false);

      const text = ref('');
      const notifications = ref([])
      const recipients = ref();



      onMounted(async () => {
        recipients.value = await getAllUsers();
        recipients.value = recipients.value.filter(recipient => recipient.username !== store.state.username)
        const resp = await getNewNotifications(store.state.username);
        if (resp.message === 'New notifications found'){
          notifications.value = resp.data
        }
      })

      const icon = computed(() => {
        switch (selectedNotification.value?.type) {
          case 'message':
            return '📩';
          case 'reminder':
            return '🔔';
          case 'calendar':
            return '📅';
          case 'invite':
            return '📨';
          case 'pomodoro':
            return '🍅';
          default:
            return 'ℹ️';
        }
      })

      const selectedRecipient = ref('');

      const removeNotification = (id) => {
        notifications.value.find(notification => notification._id === id)
        readNotification(id);
        notifications.value = notifications.value.filter(notification => notification._id !== id)
      }

      const openModal = (id) => {
        showModal.value = true
        selectedNotification.value = notifications.value.find(notification => notification._id === id)
      }

      const closeModal = () => {
        showModal.value = false
      }

      const closeSendMessageModal = () => {
        showSendMessageModal.value = false
        selectedRecipient.value = ''
        text.value = ''
      }

      const showSendMessageModal = ref(false)

      const openSendMessageModal = () => {
        showSendMessageModal.value = true
      }


      const sendMessage = () => {
        if (selectedRecipient.value) {

          sendNotification(store.state.username,selectedRecipient.value, text.value);
          closeSendMessageModal();
          closeModal();
        }
      }

      watchEffect(() => {
        if (store.state.pushNotification != null){
          notifications.value.push(store.state.pushNotification)

        }
        store.state.pushNotification = null
      })

      const accept = (id,notificationId,type) => {
        acceptInvite(id,store.state._id,notificationId,type)
        closeModal();
        removeNotification(notificationId);
      }

      const decline = (notificationId) => {
        declineInvite(notificationId)
        closeModal();
        removeNotification(notificationId);
      }

      const goToStudy = (study, relax, cycles ) => {
        router.push({
          name: 'pomodoro',
          query: { study, relax, cycles }
        });

        closeModal();
      }

      const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleString('it-IT', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      }


      return {
        removeNotification,
        openModal,
        closeModal,
        notifications,
        showModal,
        selectedNotification,
        showSendMessageModal,
        openSendMessageModal,
        closeSendMessageModal,
        recipients,
        selectedRecipient,
        sendMessage,
        text,
        icon,
        accept,
        decline,
        goToStudy,
        formatDate
      }

    }
  }
  
  </script>
  
  <style>
  </style>
  