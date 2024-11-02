<template>
    <!--<button class="fixed top-8 right-8 bg-fourth text-third border border-third p-2 rounded-lg" @click="openSendMessageModal">Nuovo Messaggio</button>
--><button class="bg-white fixed mt-20 right-4 border-2 border-third p-2 rounded-lg" @click="openSendMessageModal">Nuovo Messaggio</button>
 
    <div class="bg-primary min-h-screen p-8 flex flex-col items-center">
      <h1 class="text-3xl font-extrabold text-secondary mb-6">Notifiche</h1>

      <div v-if="notifications.length" class="space-y-6 w-full max-w-xl">
        <NotifyToggle 
          v-for="(notification, index) in notifications" 
          :key="index" 
          :icon="notification.icon" 
          :title="notification.title" 
          :message="notification.message" 
          :time="notification.time"
          @remove="removeNotification(index)"
          @open="openModal(index)"
        />
      </div>
      <div v-else class="text-center text-secondary mt-8">
        <p>Nessuna notifica al momento.</p>
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
        <option v-for="recipient in recipients" :key="recipient" :value="recipient">
          {{ recipient }}
        </option>
      </select>
        <textarea class="w-full h-32 p-2 border border-third rounded-lg" placeholder="Scrivi il tuo messaggio..."></textarea>
        <button class="bg-third text-primary p-2 m-2 rounded-lg" @click="sendMessage">Invia</button>
      </Modal>

    </div>
    
  </template>
  
  <script>

  import Modal from '@/components/Modal.vue';
  import NotifyToggle from '@/components/Notifications/NotifyToggle.vue';
  import { ref } from 'vue';
  
  export default {
    name: "NotificationPage",
    components: {
      NotifyToggle,
      Modal
    },
    setup(){
      const selectedNotification = ref(null);
      const showModal = ref(false);
      const notifications = ref([
          {
            icon: '🔔',
            title: 'Nuovo Messaggio',
            message: 'Hai ricevuto un nuovo messaggio!',
            time: '2 minuti fa',
            type: 'message'
          },
          {
            icon: '📅',
            title: 'Promemoria Evento',
            message: 'Non dimenticare l’evento di oggi!',
            time: '1 ora fa',
            type: 'event'
          },
        ])

        const recipients = ref(['Mario Rossi', 'Luca Bianchi', 'Giulia Verdi']); // Lista di destinatari
        const selectedRecipient = ref(''); // Destinatario selezionato per il messaggio

      const removeNotification = (index) =>{
        notifications.value.splice(index, 1)
      }      
      
      const openModal = (index)=>{
        showModal.value = true
        selectedNotification.value = notifications.value[index]
      }

      const closeModal = () => {
        showModal.value = false
      }

      const closeSendMessageModal = () => {
        showSendMessageModal.value = false
      }

      const showSendMessageModal = ref(false)

      const openSendMessageModal = () => {
        showSendMessageModal.value = true
      }



      const sendMessage = () => {
        if (selectedRecipient.value) {
          // Logica per inviare il messaggio
          console.log(`Messaggio inviato a ${selectedRecipient.value}`);
          closeSendMessageModal();
        } else {
          console.log("Seleziona un destinatario");
        }
      }

      return{
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
        sendMessage
      }
    }
  }
  
  </script>
  
  <style>
  </style>
  