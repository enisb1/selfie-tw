<template>
    <div class="flex flex-col items-center mx-auto m-10">
        <button @click="toggleAddResourceModal" class="bg-white w-10 p-2 rounded-full border border-third">
            <img src="../images/add.png" class="w-full">
        </button>
        <div v-for="resource in resources" class="w-3/4 sm:w-1/4 font-semibold text-lg mt-4 bg-white bg-opacity-50 py-2 px-4 rounded-lg">
            <div class="flex justify-between">
                <p class="max_width_half truncate"> {{ resource.username }} </p>
                <button @click="onDeleteResource(resource._id)"><img src="../images/delete-black.png"></button>
            </div>
        </div>
    </div>

    <Modal v-show="showAddResourceModal" @close="toggleAddResourceModal">
        <form @submit.prevent="addResource">
            <header>
                <div class="flex items-center justify-between flex-row">
                    <p class="font-bold text-secondary">Add resource</p>
                    <button type="button" @click="toggleAddResourceModal"><img class="w-4 h-4 mr-2 hover:border-2 border-secondary"
                    src="../images/x.png" alt="Croce"></button>
                </div>
                <hr style="border-color: black"/>
            </header>

            <div class="mt-4">
                <p class="font-semibold text-base">Name</p>
                <input class="border border-third" type="text" maxlength="30" required v-model="resourceToAddUsername">
            </div>

            <button type="submit" class="w-full mt-4 rounded-md bg-secondary px-3 py-2 text-md font-semibold 
                text-white shadow-sm ring-1 ring-inset ring-gray-300">Add</button>
        </form>
    </Modal>
</template>

<script>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { getResources, postResource, deleteResource } from '@/apis/calendar';
import Modal from '@/components/Modal.vue';

export default {
    components : {
        Modal
    },
    setup() {
        const resources = ref()
        const updateResources = async () => {
            resources.value = await getResources()
        }
        
        const showAddResourceModal = ref(false)
        const toggleAddResourceModal = () => {
            resourceToAddUsername.value = ''
            showAddResourceModal.value = !showAddResourceModal.value
        }

        const resourceToAddUsername = ref()

        const addResource = async () => {
            await postResource(resourceToAddUsername.value)
            toggleAddResourceModal()
            updateResources()
        }

        const onDeleteResource = async (resourceId) => {
            await deleteResource(resourceId)
            updateResources()
        }

        onMounted(() => {
            updateResources()
        })

        return {
            resources,
            showAddResourceModal,
            toggleAddResourceModal,
            addResource,
            resourceToAddUsername,
            onDeleteResource
        }
    }
}
</script>

<style>
    .max_width_half {
        max-width: 50%;
    }

</style>