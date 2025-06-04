"use strict";


let inputField = document.querySelector("#input");
let previewField = document.querySelector("#preview");
let keypad = document.querySelector("#keypad");

let input = "";
let preview = "";

keypad.addEventListener("click", function (event) {
    let button = event.target.closest("button");
    if (!button || !keypad.contains(button)) return;
    let type = button.dataset.type;
    if (type == "ac") {
        clearAll();
        return;
    }
    if (type == "number") {
        addDigit(button.value);
        calculate(input);
        return;
    }
    if (type == "operator") {
        addOperator(button.value);
        calculate(input);
        return;
    }
    if (type == "point") {
        addPoint(button.value);
        calculate(input);
        return;
    }
    if (type == "delete") {
        removeDigit();
        calculate(input);
        return;
    }
    if (type == "equal") {
        input = "" + preview;
        preview = "";
        inputField.innerHTML = input;
        previewField.innerHTML = preview;
        return;
    }
});

function addDigit(digit) {
    let lastNumber = getLastNumber(input);
    if (digit != "0") {
        if (lastNumber == "0" && !lastNumber.includes(".")) {
            input = input.slice(0, input.length - 1) + digit
        } else {
            input += digit;
        }
        return;
    }
    if (!lastNumber || lastNumber.includes(".") || lastNumber != 0) {
        input += digit;
        return;
    }
}

function removeDigit() {
    if (input.length === 0) return;
    input = input.slice(0, input.length - 1);
}

function addPoint(point) {
    let lastNumber = getLastNumber(input);
    if (!lastNumber) {
        input += "0" + point;
        return;
    }
    if (!lastNumber.includes(".")) {
        input += point;
        return;
    }
}

function clearAll() {
    input = "";
    preview = "";
    inputField.innerHTML = "";
    previewField.innerHTML = "";
}

function addOperator(operator) {
    if (input.length === 0) {
        if ("+-".includes(operator)) input += operator;
        return;
    }
    if (input.length === 1) {
        let first = input.at(0);
        if ("+-".includes(first) && "+-".includes(operator)) {
            input = operator;
        } else if (isFinite(first)) {
            input += operator
        }
        return;
    }
    let last = input.at(-1);
    if (isFinite(last)) {
        input += operator;
    } else {
        input = input.slice(0, -1) + operator;
    }
}

function getLastNumber(equation) {
    function lastOperatorIndex() {
        return Math.max(
            equation.lastIndexOf("+"),
            equation.lastIndexOf("-"),
            equation.lastIndexOf("*"),
            equation.lastIndexOf("/")
        );
    }
    return equation.slice(lastOperatorIndex() + 1);
}

function calculate(equation) {
    if (isFinite(input.at(-1))) {
        preview = eval(equation) ?? "";
    } else {
        preview = eval(input.slice(0, input.length - 1)) ?? "";
    }
    let equationAsStr = equation.replaceAll("*", "×");
    equationAsStr = equationAsStr.replaceAll("-", "−");
    equationAsStr = equationAsStr.replaceAll("/", "÷");
    inputField.innerHTML = equationAsStr;
    inputField.scrollLeft = inputField.scrollWidth - inputField.clientWidth;
    if (isFinite(preview)) {
        previewField.innerHTML = preview;
    } else {
        preview = ""
        previewField.innerHTML = "Math ERROR";
    }
}


