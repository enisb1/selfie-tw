<template>
   <div class="bg-primary min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-secondary mb-6 text-center">Selfie</h2>

      <form method="POST" @submit.prevent="login">
         <div class="mb-4">
         <label for="username" class="block text-third text-sm font-bold mb-2">Username</label>
         <input v-model="username" id="username" name="username" required
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline">
         </div>
         
         <div class="mb-6">
         <label for="password" class="block text-third text-sm font-bold mb-2">Password</label>
         <input v-model="password" type="password" id="password" name="password" required
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-secondary mb-3 leading-tight focus:outline-none focus:shadow-outline">
         </div>

         <div class="flex items-center justify-between">
         <button type="submit" class="bg-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-secondary">
            Log in
         </button>

         <RouterLink to="/signup" class="inline-block align-baseline font-bold text-sm text-accent hover:text-secondary">Sign Up!</RouterLink>
      </div>
      </form>
      </div>
  </div>

  <modal v-if="showModal" @close="triggerModal">
    <h3 class="text-red-700 text-center">{{messageError}}</h3>
  </modal>

</template>

<script>
import {ref} from "vue";
import Modal from "@/components/Modal.vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
import {checkUserPassword} from "@/apis/users";

export default{
  components: {Modal},
   setup() {
     let username = ref('');
     let password = ref('');
     let messageError = ref('');
     const store = useStore()
     const router = useRouter();
     store.commit('disconnect');
     store.commit('flushUser');
     sessionStorage.clear();



     const login = async () => {


       try {
         const data = await checkUserPassword(username.value, password.value);
         store.commit('setUser', data.user);
         sessionStorage.setItem('state', JSON.stringify(store.state));
         store.commit('connect');
         await router.push({name: 'home'});
       } catch (error) {
         messageError.value = error.message;
         triggerModal()
       }
     }

     const showModal = ref(false);
     const triggerModal = () => {
        showModal.value = !showModal.value;
     }

     return{
       username,
       password,
       login,
       showModal,
       triggerModal,
       messageError
    }
   },
   created() {
    
   },
   mounted(){

   }
}
</script>

<style>
   .text-accent { color: #ab9f9d; }
</style>