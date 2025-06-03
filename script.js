"use strict";


let inputField = document.querySelector("#input");
let previewField = document.querySelector("#preview");
let keypad = document.querySelector("#keypad");

let input = "";

keypad.addEventListener("click", function (event) {
    let button = event.target.closest("button");

    if (!button || !keypad.contains(button)) return;

    console.log(button.value);
});