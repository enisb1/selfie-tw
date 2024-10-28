<template>
    
    <!--title and add button-->
    <div v-show="outContact" class="flex justify-between items-center w-full p-4 mt-2
                md:w-1/3">
        <div class="font-extrabold text-2xl text-secondary">Chat</div>
        <button class="">
            <img class="w-6" src="../images/addSecondary.png">
        </button>
    </div>

    <!--searchbar-->
    <div v-show="outContact" class="relative px-4 mt-2
                md:w-1/3">
        <input type="text" placeholder="Search" class="rounded-3xl text-left pl-7 w-full">
        <img class="absolute top-1/2 -translate-y-1/2 w-4 ml-2" src="../images/search.png">
    </div>

    <!--chatview-->
    <div v-show="inContact" class="fixed top-16 py-2 px-4 w-full
                md:visible md:w-2/3 md:right-0">
        <!--contactbar-->        
        <div :class="{'flex justify-between':largeScreen, 'flex justify-start':!largeScreen}" class="flex items-center">
            <button v-if="!largeScreen">
                <img class="p-2 w-10" src="../images/returnButton.png">
            </button>
            <div class="flex justify-start items-center">
                <img class=" p-2" src="../images/prova.png">
                <div class="font-bold text-2xl text-secondary">ContattoUno</div>
            </div>
            <button>
                <img class="p-2 w-10" src="../images/trePallini.png">
            </button>

        </div>

        <div class="fixed h-3/4 bg-white mt-2 overflow-y-scroll left-0
                    md:w-2/3 md:left-auto">
            <ul class="flex flex-col px-4 text-white mb-6">
                <li class="relative self-start bg-secondary rounded-xl mt-4 mb-2 min-w-24 max-w-lg shadow-2xl">
                    <p class="py-4 p-2 mb-2">Ciaoooooooooooooooooooooooooooooo!</p>
                    <span class="absolute bottom-0 right-0 text-white text-sm p-1">26 Oct 13:54</span>   
                </li>
                <li class="relative self-end bg-secondary rounded-xl my-2 min-w-24 max-w-lg shadow-2xl">
                    <p class="py-4 p-2 mb-2">Ciaoo, come stai?</p>
                    <span class="absolute right-0 bottom-0 text-white text-sm p-1">26 Oct 13:57</span>
                </li>
                <li class="relative self-start rounded-xl bg-secondary min-w-24 max-w-lg my-2 shadow-2xl">
                    <p class="py-4 p-2 mb-2">Bene bene</p>
                    <span class="absolute right-0 bottom-0 text-white text-sm p-1">26 Oct 14:06</span>
                </li>
                <li class="relative self-end rounded-xl bg-secondary min-w-24 max-w-lg my-2 shadow-2xl">
                    <p class="py-4 p-2 mb-2">
                        Te?Lorem ipsum dolor sit amet, consectetur 
                        adipisicing elit. A optio commodi officia sit aliquid rem. 
                        Exercitationem quasi sed reprehenderit aperiam nesciunt unde obcaecati 
                        vitae recusandae nostrum assumenda! Fuga, voluptate quibusdam.
                    </p>
                    <span class="absolute right-0 bottom-0 text-white text-sm p-1">26 Oct 14:34</span>
                </li>
                <li class="relative self-start rounded-xl bg-secondary min-w-24 max-w-lg my-2 shadow-2xl">
                    <p class="py-4 p-2 mb-2">Anch'io</p>
                    <span class="absolute right-0 bottom-0 text-white text-xs p-1">26 Oct 14:35</span>
                </li>
                <li class="relative self-end rounded-xl bg-secondary min-w-24 max-w-lg my-2 shadow-2xl">
                    <p class="py-4 p-2 mb-2">Dajeeee!</p>
                    <span class="absolute right-0 bottom-0 text-white text-sm p-1">26 Oct 15:54</span>
                </li>
                <li class="relative self-start rounded-xl bg-secondary min-w-24 max-w-lg my-2 shadow-2xl">
                    <p class="py-4 p-2 mb-2">Daje Romaaaaa!</p>
                    <span class="absolute right-0 bottom-0 text-white text-sm p-1">26 Oct 15:54</span>
                </li>
                <li class="relative self-end rounded-xl bg-secondary min-w-24 max-w-lg my-2 mb-6 shadow-2xl">
                    <p class="py-4 p-2 mb-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing 
                        elit. Et blanditiis quasi distinctio? Consequuntur, fugit. 
                        Dolores commodi maxime, veniam, autem assumenda impedit tempora explicabo 
                        ratione quidem nisi illum reprehenderit repudiandae quasi!
                    </p>
                    <span class="absolute right-0 bottom-0 text-white text-sm p-1">26 Oct 15:54</span>
                </li>
            </ul>
            
        </div>
        <!--writingbar-->
        <div class="fixed bottom-0 bg-secondary p-4 w-full
                    md:w-2/3">
            <form action="#" class="flex justify-between items-center">
                <input class="w-full mr-4" type="text">
                <button>
                    <img class="w-7 mr-4" src="../images/sendWhite.png" alt="sendIcon">
                </button>
            </form>
        </div>
    </div>


    <!--contacts-->
    <div  v-show="outContact" class="p-4 grid grid-cols-1 gap-3 divide-y divide-secondary 
                md:w-1/3">
        <div @click="chatView" :class="{'bg-secondary text-white rounded-xl' :inContact}" class="w-full h-16 flex justify-start text-secondary">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="pt-1 font-semibold">ContattoUno</h3>
                <p class="text-xxs">Lorem ipsum dolor sit amet consec tetur adipisicing elit...</p>
            </div>
        </div>
        <div class="w-full h-16  flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit...</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
        <div class="w-full h-16 flex justify-start">
            <img class=" p-2" src="../images/prova.png">
            <div>
                <h3 class="text-secondary pt-1 font-semibold">ContattoUno</h3>
                <p class="text-secondary text-xs">Lorem ipsum dolor sit amet consec tetur adipisicing elit.</p>
            </div>
        </div>
    </div>

   


  
</template>

<script>
import {onBeforeMount, ref, onMounted } from 'vue';

export default {
    setup(){

        const inContact = ref(false)
        const outContact =ref(true)
        const largeScreen = ref(false)

        const checkScreen = () => {
              largeScreen.value = window.innerWidth >= 768;
        }

        const chatView = () => {
            if(largeScreen.value == true){
                inContact.value = !inContact.value
            }else{
                inContact.value = true
                outContact.value = false
            }
            
        }


       


        onMounted(() => {
            checkScreen()
            window.addEventListener('resize', checkScreen)
        })

        onBeforeMount(() => {
            window.removeEventListener('resize', checkScreen)
        })
        

        


        
        
    return{
        inContact,
        outContact,
        largeScreen,
        chatView,
        checkScreen

       
    }
    }
}
</script>

<style>
.whitespace-nowrap {
    white-space: nowrap;
}

.inline-flex{
    display: inline-flex;
}

.self-start{
    align-self: flex-start;
}

.self-end{
    align-self: flex-end;
}

.flex-col{
    flex-direction: column;
}



</style>