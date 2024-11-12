<template>

    <div @click="$emit('open')" class="bg-white border border-third p-6 rounded-2xl shadow-lg flex items-start space-x-5 transition-transform transform hover:scale-105">
      
      <div class="flex-shrink-0 bg-third text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
        <span class="text-2xl font-semibold">{{ icon }}</span>
      </div>

      
      <div class="flex-1 space-y-2">
        <h2 class="text-lg font-semibold text-secondary">{{ title }}</h2>
        <p class="text-sm text-secondary">{{ message }}</p>
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
  export default {
    setup(){

    },
    name: "NotifyToggle",
    props: {
      icon: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      }
    }
  };
  </script>

  <style>
  </style>