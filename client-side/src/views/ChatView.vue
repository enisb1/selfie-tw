<template>
    <div class="flex justify-between items-center p-4">
        <div class="font-extrabold text-2xl text-secondary">Chat</div>
        <button>
            <img class="w-6" src="../images/trePallini.png">
        </button>
    </div>

    <div class="relative px-4">
        <input type="text" placeholder="Search" class="rounded-3xl text-left pl-7 w-full bottom-0">
        <img class="absolute top-1/2 -translate-y-1/2 w-4 ml-2" src="../images/search.png">
    </div>
    
    <div class="fixed h-3/4 overflow-y-scroll left-0 w-full">
        <ul class="flex flex-col px-6 text-white mb-6">
            <li class="relative self-start bg-secondary rounded-xl mt-4 mb-2 min-w-28 max-w-lg shadow-2xl">
                <span class="absolute top-1 left-3 font-bold">Tu</span>
                <p class="px-3 py-6">Ciaoooooooooooooooooooooooooooooo!</p>
                <span class="absolute bottom-1 right-3 text-sm">26 Oct 13:54</span>   
            </li>
            <li class="relative self-end bg-secondary rounded-xl my-2 min-w-28 max-w-lg shadow-2xl">
                <span class="absolute top-1 left-3 font-bold">Enis</span>
                <p class="px-3 py-6">Ciaoo, come stai?</p>
                <span class="absolute right-3 bottom-1 text-sm">26 Oct 13:57</span>
            </li>
            <li class="relative self-end bg-secondary rounded-xl my-2 min-w-28 max-w-lg shadow-2xl">
                <span class="absolute top-1 left-3 font-bold">Enrico</span>
                <p class="px-3 py-6">Lorem ipsum dolor sit amet, consectetur adipisicing elit. 
                    Consequuntur nisi animi doloribus soluta illo at? Quia autem quis, 
                    distinctio nihil rerum dicta nemo soluta ab nesciunt ea, et, suscipit ducimus.
                </p>
                <span class="absolute right-3 bottom-1 text-sm">26 Oct 13:57</span>
            </li>
            <li class="relative self-start bg-secondary rounded-xl mt-4 mb-2 min-w-28 max-w-lg shadow-2xl">
                <span class="absolute top-1 left-3 font-bold">Tu</span>
                <p class="px-3 py-6">OK</p>
                <span class="absolute bottom-1 right-3 left-3 text-sm">26 Oct 13:54</span>   
            </li>
            <li class="relative self-end bg-secondary rounded-xl my-2 min-w-28 max-w-lg shadow-2xl">
                <span class="absolute top-1 left-3 font-bold">Enis</span>
                <p class="px-3 py-6">Ciaoo, come stai?
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                    Optio quam maxime expedita enim vero sed placeat reiciendis, veritatis 
                    epellendus dolorum laborum nostrum, 
                    odio quod quasi quisquam alias! Hic, consequuntur ratione!
                </p>
                <span class="absolute right-3 bottom-1 text-sm">26 Oct 13:57</span>
            </li>
            <li class="relative self-start bg-secondary rounded-xl mt-4 mb-2 min-w-28 max-w-lg shadow-2xl">
                <span class="absolute top-1 left-3 font-bold">Tu</span>
                <p class="px-3 py-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Accusantium quia dicta nobis doloribus, impedit cupiditate! Esse illo, voluptatem 
                    voluptatum soluta eos quis quasi id, beatae facere aliquid voluptate odit vero?
                </p>
                <span class="absolute bottom-1 right-3 left-3 text-sm">26 Oct 13:54</span>   
            </li>
            <li class="relative self-start bg-secondary rounded-xl mt-4 mb-2 min-w-28 max-w-lg shadow-2xl">
                <span class="absolute top-1 left-3 font-bold">Tu</span>
                <p class="px-3 py-6">OK</p>
                <span class="absolute bottom-1 right-3 left-3 text-sm">26 Oct 13:54</span>   
            </li>
        </ul>
    </div>

    <!--writingbar-->
    <div class="fixed bottom-0 left-0 w-full bg-secondary p-4">
        <form action="#" class="flex justify-between items-center">
            <input class="w-full mr-2 rounded-3xl" type="text">
            <button>
                <img class="w-7 " src="../images/sendWhite.png" alt="sendIcon">
            </button>
        </form>
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



.self-start{
    align-self: flex-start;
}

.self-end{
    align-self: flex-end;
}

.flex-col{
    flex-direction: column;
}

.z-10{
    z-index: 10;
}

.backdrop-blur-pp{
    filter: blur(24px)
}


</style>