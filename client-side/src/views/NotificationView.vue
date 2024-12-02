<template>
    <button class="bg-white fixed mt-20 right-4 border-2 border-third p-2 rounded-lg" @click="openSendMessageModal">Nuovo Messaggio</button>
 
    <div class="bg-primary min-h-screen p-8 flex flex-col items-center">
      <h1 class="text-3xl font-extrabold text-secondary mb-6">Notifiche</h1>

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
        <p>Nessuna nuova notifica al momento.</p>
      </div>
      
      <Modal v-if="showModal" @close="closeModal()">
        <span class="text-2xl font-semibold">{{ selectedNotification.icon }}</span>
        <h1 class="text-2xl font-semibold text-secondary mb-6">{{selectedNotification.title}}</h1>
        <p class="text-secondary">{{ selectedNotification.message }}</p>
        <span class="text-xs text-third block">{{ selectedNotification.time }}</span>
        <button class="bg-third text-primary p-2 m-2 rounded-lg" v-if="selectedNotification.type=='message'" @click="openSendMessageModal" >Rispondi</button>
      </Modal>

      <Modal v-if="showSendMessageModal" @close="closeSendMessageModal()">
        <h1 class="text-2xl font-semibold text-secondary border- mb-6">Invia un messaggio</h1>
        <select v-model="selectedRecipient" class="w-full p-2 border border-third rounded-lg mb-4">
        <option disabled value="">Seleziona il destinatario</option>
        <option v-for="recipient in recipients" :key="recipient.username" :value="recipient.username">
          {{ recipient.username }} [{{ recipient.firstName }} {{ recipient.lastName }}]
        </option>
      </select>
        <textarea v-model="text" class="w-full h-32 p-2 border border-third rounded-lg" placeholder="Scrivi il tuo messaggio..."></textarea>
        <button class="bg-third text-primary p-2 m-2 rounded-lg" @click="sendMessage">Invia</button>
      </Modal>

    </div>
    
  </template>
  
  <script>

  import Modal from '@/components/Modal.vue';
  import NotifyToggle from '@/components/Notifications/NotifyToggle.vue';
  import {onMounted, ref, watchEffect} from 'vue';
  import {getAllUsers} from "@/apis/users";
  import user from "../../../server-side/models/User";
  import {getNewNotifications, readNotification, sendNotification} from "@/apis/notifications";
  import {useStore} from "vuex";
  
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
          console.log("nuove notifiche trovate")
          console.log(resp.data)
          notifications.value = resp.data
        }
      })

      const selectedRecipient = ref(''); // Destinatario selezionato per il messaggio

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
        } else {
          console.log("Seleziona un destinatario");
        }
      }

      watchEffect(() => {
        if (store.state.pushNotification != null){
          notifications.value.push(store.state.pushNotification)

        }
        store.state.pushNotification = null
      })


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
        text
      }

    }
  }
  
  </script>
  
  <style>
  </style>
  