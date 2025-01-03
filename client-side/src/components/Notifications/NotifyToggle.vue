<template>

    <div @click="$emit('open')" class="bg-white border border-third p-6 rounded-2xl shadow-lg flex items-start space-x-5 transition-transform transform hover:scale-105">
      
      <div class="flex-shrink-0 bg-third text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
        <span class="text-2xl font-semibold">{{ icon }}</span>
      </div>

      
      <div class="flex-1 space-y-2">
        <h2 class="text-lg font-semibold text-secondary">{{ title }}</h2>
        <p class="text-sm text-secondary">{{ text }}</p>
        <span class="text-xs text-fourth block">{{ time }}</span>
      </div>

      <button 
        @click.stop="$emit('remove')" 
        class="ml-auto text-fourth hover:text-third transition-colors text-xl"
        aria-label="Chiudi notifica"
      >
        ✕
      </button>
    </div>

  </template>

  <script>
  import {ref} from "vue";

  export default {
    setup(props){

      const icon = ref('');

      if (props.type === 'calendar') {
        icon.value = '📅';
      } else if (props.type === 'reminder') {
        icon.value = '🔔';
      } else if (props.type === 'message') {
        icon.value = '📩';
      } else if (props.type === 'invite') {
        icon.value = '📨';
      }

      return {
        icon
      }
    },
    name: "NotifyToggle",
    props: {
      title: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      sender: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      _id: {
        type: String,
        required: true
      }
    }
  };
  </script>

  <style>
  </style>