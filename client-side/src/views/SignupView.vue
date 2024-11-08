<template>
    <div class="bg-primary min-h-screen flex items-center justify-center">

    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-bold text-third mb-6 text-center">Registrati</h2>

    <form method="POST" @submit.prevent="register">
        <!-- Nome -->
        <div class="mb-4">
        <label for="nome" class="block text-third text-sm font-bold mb-2">Nome</label>
        <input v-model:="name" type="text" id="nome" name="nome" required
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-third leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <!-- Cognome -->
        <div class="mb-4">
        <label for="cognome" class="block text-third text-sm font-bold mb-2">Cognome</label>
        <input v-model="surname" type="text" id="cognome" name="cognome" required
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-third leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <!-- Username -->
        <div class="mb-4">
        <label for="username" class="block text-third text-sm font-bold mb-2">Username</label>
        <input v-model="username" type="text" id="username" name="username" required
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-third leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <!-- Email -->
        <div class="mb-4">
        <label for="email" class="block text-third text-sm font-bold mb-2">Email</label>
        <input v-model="email" type="email" id="email" name="email" required
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-third leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <!-- Password -->
        <div class="mb-4">
        <label for="password" class="block text-third text-sm font-bold mb-2">Password</label>
        <input v-model="password" type="password" id="password" name="password" required
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-third leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <!-- Telegram -->
        <div class="mb-6">
        <label for="telegram" class="block text-third text-sm font-bold mb-2">Telegram</label>
        <input v-model="telegram" type="text" id="telegram" name="telegram"
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-third leading-tight focus:outline-none focus:shadow-outline">
        </div>

        <!-- Bottone Registrati -->
        <div class="flex items-center justify-between">
        <button type="submit" class="bg-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-third">
            Registrati
        </button>

        <RouterLink to="/login" class="inline-block align-baseline font-bold text-sm text-accent hover:text-third">Hai già un account? Accedi</RouterLink>
        </div>
    </form>
    </div>

    </div>
</template>

<script>
  import {ref} from "vue";
  import {newUser} from "@/apis/users";

  export default{
    setup() {
      let name = ref('');
      let surname = ref('');
      let username = ref('');
      let password = ref('');
      let email = ref('');
      let telegram = ref('');

      const register = async () => {
        console.log("Registering user...");
        let resp = await newUser(username.value, password.value, email.value, name.value, surname.value, telegram.value)
        console.log(resp);
      }

      return{
        name,
        surname,
        username,
        password,
        email,
        telegram,
        register
      }
    }
  }
 </script>
 
 <style>
    .bg-accent { background-color: #d1beb0; }
    .text-accent { color: #ab9f9d; }
 </style>