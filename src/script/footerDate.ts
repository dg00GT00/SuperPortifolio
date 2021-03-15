const date: HTMLDivElement | null = document.querySelector(".current-year");
if (date) {
    date.innerText = new Date().getFullYear().toString();
}
