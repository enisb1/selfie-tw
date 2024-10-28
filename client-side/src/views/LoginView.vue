<template>
   <div class="bg-primary min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-secondary mb-6 text-center">Selfie</h2>

      <form action="homepage.html" method="POST">
         <div class="mb-4">
         <label for="username" class="block text-third text-sm font-bold mb-2">Username</label>
         <input type="username" id="username" name="username" required
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-secondary leading-tight focus:outline-none focus:shadow-outline">
         </div>
         
         <div class="mb-6">
         <label for="password" class="block text-third text-sm font-bold mb-2">Password</label>
         <input type="password" id="password" name="password" required
            class="shadow appearance-none border border-secondary rounded w-full py-2 px-3 text-secondary mb-3 leading-tight focus:outline-none focus:shadow-outline">
         </div>

         <div class="flex items-center justify-between">
         <button type="submit" class="bg-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-secondary">
            Accedi
         </button>

         <RouterLink to="/signup" class="inline-block align-baseline font-bold text-sm text-accent hover:text-secondary">Registrati!</RouterLink>
      </div>
      </form>
      </div>
  </div>

</template>

<script>
export default{
   setup() {//runna prima di mount
    // i valori qui non sono reattivi come in data



    return{//nomi delle variabili che voglio ce il component veda
    }
   },
   created() {
    
   },
   mounted(){

   }
}
</script>

<style>
   .bg-accent { background-color: #d1beb0; }
   .text-accent { color: #ab9f9d; }
</style>