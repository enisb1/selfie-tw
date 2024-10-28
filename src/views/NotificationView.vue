<template>
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
        />
      </div>
      
      <div v-else class="text-center text-secondary mt-8">
        <p>Nessuna notifica al momento.</p>
      </div>
    </div>
  </template>
  
  <script>
  import NotifyToggle from '@/components/Notifications/NotifyToggle.vue';
  
  export default {
    name: "NotificationPage",
    components: {
      NotifyToggle
    },
    data() {
      return {
        notifications: [
          {
            icon: '🔔',
            title: 'Nuovo Messaggio',
            message: 'Hai ricevuto un nuovo messaggio!',
            time: '2 minuti fa'
          },
          {
            icon: '📅',
            title: 'Promemoria Evento',
            message: 'Non dimenticare l’evento di oggi!',
            time: '1 ora fa'
          },
        ]
      };
    },
    methods: {
      removeNotification(index) {
        this.notifications.splice(index, 1);
      }
    }
  };
  </script>
  
  <style>
  </style>
  