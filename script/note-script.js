
title_tag = document.getElementById("note_title"),
category_tag = document.getElementById("note_category"),
access_tag = document.getElementById("access_list");


document.getElementById("button_add").addEventListener("click", () => {
    document.getElementById("backdrop").classList.remove("hidden"),
    document.getElementById("popup_add").classList.remove("hidden")
})

document.getElementById("backdrop").addEventListener("click", () => {
    document.getElementById("backdrop").classList.add("hidden"),
    document.getElementById("popup_add").classList.add("hidden")
})

document.getElementById("add_notatask").addEventListener("click", () => {
    document.getElementById("popup_add_note").classList.remove("hidden")
})

document.getElementById("closeAdd").addEventListener("click", () => {
    document.getElementById("popup_add_note").classList.add("hidden")
})

document.getElementById("button_filter_xl").addEventListener("click", () => {
    document.getElementById("popup_add_filter").classList.remove("hidden")
})

document.getElementById("closeFilter").addEventListener("click", () => {
    document.getElementById("popup_add_filter").classList.add("hidden")
})

document.getElementById("button_filter_sm").addEventListener("click", () => {
    document.getElementById("popup_add_filter").classList.remove("hidden")
})

document.getElementById("closeFilter").addEventListener("click", () => {
    document.getElementById("popup_add_filter").classList.add("hidden")
})

document.getElementById("button_note_page").addEventListener("click", function() {
    window.location.href = "notePage.html";
})

document.getElementById("button_all_page").addEventListener("click", function() {
    window.location.href = "index.html";
})
   
document.getElementById("button_task_page").addEventListener("click", function() {
    window.location.href = "taskPage.html";
})



document.getElementById("SaveButton").addEventListener("click", e => {
    e.preventDefault();
    let note_title = title_tag.value,
    note_category = category_tag.value,
    note_access = access_tag.value;

    if(note_title || note_category){
    console.log(note_title, note_category, note_access);
    }

})