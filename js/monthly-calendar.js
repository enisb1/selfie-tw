document.addEventListener("DOMContentLoaded", () => {
    const calendarContainer = document.getElementById("monthly_calendar_container");
    const top = calendarContainer.getBoundingClientRect().top;
    const remainingHeight = window.innerHeight - top;   // window.innerHeight is the height of the viewport
    // set monthly calendar grid to take up the remaining vertical space of the viewport
    calendarContainer.style.minHeight = `${remainingHeight}px`;
});