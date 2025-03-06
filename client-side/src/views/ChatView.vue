<template>

  <div class="absolute top-16 bottom-16 overflow-y-auto left-0 w-full z-10" ref="messagesContainer">
    <!-- Lista dei messaggi -->
    <ul class="flex flex-col px-6 space-y-2">
      <li v-for="message in chatMessages" >
        <ChatMessage
            :message="message.message"
            :sender="message.sender"
            :time="new Date(message.time)"
        />
      </li>
    </ul>
  </div>

  <!-- Input per nuovi messaggi -->
  <div class="fixed bottom-0 left-0 w-full bg-secondary p-4 z-10">
    <div class="flex justify-between items-center">
      <input
          class="w-full mr-2 p-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Write a message..."
          v-model="text"
          @keyup.enter="addMessage"
      />
      <button
          class="p-2 rounded-full bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          @click="addMessage"
      >
        <img class="w-6 h-6" src="../images/sendWhite.png" alt="Send Icon">
      </button>
    </div>
  </div>
</template>
<script>
import {onBeforeMount, ref, onMounted, watchEffect, useTemplateRef, nextTick} from 'vue';
import ChatMessage from "@/components/Chat/ChatMessage.vue";
import {getChat, postMessage} from "@/apis/chat";
import {useStore} from "vuex";

export default {
  components: {ChatMessage},
  setup() {
    const store = useStore()

    const inContact = ref(false)
    const outContact = ref(true)
    const largeScreen = ref(false)

    const checkScreen = () => {
      largeScreen.value = window.innerWidth >= 768;
    }

    const chatView = () => {
      if (largeScreen.value === true) {
        inContact.value = !inContact.value
      } else {
        inContact.value = true
        outContact.value = false
      }

    }

    const messagesContainer = useTemplateRef('messagesContainer')

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        nextTick(() => {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        });
      }
    }

    onMounted(() => {
      checkScreen()
      window.addEventListener('resize', checkScreen)
    })

    onBeforeMount(() => {
      window.removeEventListener('resize', checkScreen)
    })

    const chatMessages = ref([])

    onMounted(async () => {
      const response = await getChat()
      if (response.message === 'Chat messages found') {

        chatMessages.value = response.data;
      }
      scrollToBottom()
    })

    const text = ref('');

    const addMessage = async () => {
      await postMessage(text.value, store.state.username)
      text.value = '';
      scrollToBottom()
    }

    watchEffect(() => {
      if (store.state.chatMessage != null) {
        chatMessages.value.push(store.state.chatMessage)
        scrollToBottom()
      }
      store.state.chatMessage = null
    })


    return {
      inContact,
      outContact,
      largeScreen,
      chatView,
      checkScreen,
      text,
      addMessage,
      chatMessages
    }
  }
}
</script>

<style>
</style>