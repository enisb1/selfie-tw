<template>
  <div
      class="relative my-3 py-3 px-4 rounded-xl shadow-lg"
      :class="yourMessage ? 'bg-blue-500 ml-auto text-right text-white' : 'bg-gray-300 text-gray-900 mr-auto text-left '"
      :style="{ maxWidth: '75%', wordBreak: 'break-word' }"
  >
    <!-- Sender -->
    <span
        class="block font-bold mb-1 text-sm"
        :class="yourMessage ? 'text-gray-200' : 'text-gray-600'"
        v-if="!yourMessage"
    >
      {{ sender }}
    </span>
    <!-- Message -->
    <p class="whitespace-pre-wrap text-base">
      {{ message }}
    </p>
    <!-- Time -->
    <span class="block mt-2 text-xs" :class="yourMessage ? 'text-gray-200' : 'text-gray-500'">
      {{ formatDate(time)}}
    </span>
  </div>
</template>
<script>
import {computed} from "vue";
import {useStore} from "vuex";


export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: String,
      required: true,
      default: ""
    },
    sender: {
      type: String,
      required: true
    },
    time: {
      type: Date,
      required: true
    }
  },
  setup(props) {
    const store = useStore()

    const yourMessage = computed(() => {
      return props.sender === store.state.username
    })

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
      message: props.message,
      sender: props.sender,
      time: props.time,
      yourMessage,
      formatDate
    }
  }
}

</script>

<style>
</style>