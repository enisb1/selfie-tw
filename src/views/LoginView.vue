<template>
   <div class="bg-light min-h-screen flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-main mb-6 text-center">Selfie</h2>

      <form action="homepage.html" method="POST">
         <div class="mb-4">
         <label for="username" class="block text-secondary text-sm font-bold mb-2">Username</label>
         <input type="username" id="username" name="username" required
            class="shadow appearance-none border border-main rounded w-full py-2 px-3 text-main leading-tight focus:outline-none focus:shadow-outline">
         </div>
         
         <div class="mb-6">
         <label for="password" class="block text-secondary text-sm font-bold mb-2">Password</label>
         <input type="password" id="password" name="password" required
            class="shadow appearance-none border border-main rounded w-full py-2 px-3 text-main mb-3 leading-tight focus:outline-none focus:shadow-outline">
         </div>

         <div class="flex items-center justify-between">
         <button type="submit" class="bg-main text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-secondary">
            Accedi
         </button>

         <RouterLink to="/signup" class="inline-block align-baseline font-bold text-sm text-accent hover:text-main">Registrati!</RouterLink>
      </div>
      </form>
      </div>
  </div>

</template>

<script>
export default{
   setup() {//runna prima do mount
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
   .bg-main { background-color: #383f51; }
   .bg-light { background-color: #dddbf1; }
   .text-main { color: #383f51; }
   .text-secondary { color: #3c4f76; }
   .border-main { border-color: #383f51; }
   .border-secondary { border-color: #3c4f76; }
   .bg-accent { background-color: #d1beb0; }
   .text-accent { color: #ab9f9d; }
</style>