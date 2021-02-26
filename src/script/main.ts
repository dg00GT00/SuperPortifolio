import {headerNav} from "./header/header.js";

const div = document.querySelector(".test");
if (div) {
    div.textContent = headerNav();
}