<template>
    <div @click.self="$emit('close')" class="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black bg-opacity-20">
        <div class="modal absolute bg-primary text-black w-3/4 left-1/2 -translate-x-1/2 p-4
            rounded-md shadow-sm ring-1 ring-inset ring-gray-300 overflow-y-auto max-h-4/5">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .modal {
        top: 10%;
    }
</style>