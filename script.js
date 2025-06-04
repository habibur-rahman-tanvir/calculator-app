"use strict";

// HTML elements
let inputField = document.querySelector("#input");
let previewField = document.querySelector("#preview");
let keypad = document.querySelector("#keypad");

// Global variables
let input = "";
let preview = "";


// =====================================================
// =====================================================

// Clear All
function clearAll() {
    input = "";
    preview = "";
    inputField.innerHTML = "";
    previewField.innerHTML = "";
}

// Add digit in "input" variable
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

// Add operator in "input" variable
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

// Add decimal point in "input" variable
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

// Remove digit from "input" variable
function removeDigit() {
    if (input.length === 0) return;
    input = input.slice(0, input.length - 1);
}

// Get last number as a string from "input" variable
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

// Button highlighting (for keybord input)
function highlight(elem, status = true) {
    if (status) {
        elem.classList.add("highlight");
    } else {
        elem.classList.remove("highlight");
    }
}

// Show Calculation Error
async function showError(err, ms = 1500) {
    let calculator = document.querySelector("#calculator");
    let alert = document.createElement("div");
    alert.className = "alert";
    alert.textContent = err.message;
    calculator.append(alert);
    setTimeout(() => {
        alert.remove();
    }, ms);
}

// Calculate and Update UI
function calculate(equation) {
    try {
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
    } catch (err) {
        showError(err, 2000);
        clearAll();
    }
}


// =====================================================
// =====================================================

// Click input logic (Mouse and Touch)
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


// =====================================================
// =====================================================

// Keybord input logic

// Global variables and generators (for keybord input)
function* digitsGenerator() {
    for (let i = 0; i <= 9; i++) {
        yield i + "";
    }
}
let digitValue = [...digitsGenerator()];
let oppValue = ["+", "-", "*", "/"];

// Listener for keydown to highlight button
document.addEventListener("keydown", function (event) {
    if (event.repeat) return;
    let key = event.key;
    if ([...digitValue, ...oppValue, "=", "Delete", "Backspace", "."].includes(key)) {
        let button = keypad.querySelector(`button[value="${key}"]`);
        highlight(button);
        return;
    }
    if (key === "Enter") {
        let button = keypad.querySelector(`button[value="="]`);
        highlight(button);
        return;
    }
});

// I don't know what should be Comment for this section!
document.addEventListener("keyup", event => {
    let key = event.key;
    let button = keypad.querySelector(`button[value="${key}"]`);
    if (digitValue.includes(key)) {
        highlight(button, false);
        addDigit(key);
        calculate(input);
        return;
    }
    if (oppValue.includes(key)) {
        highlight(button, false);
        addOperator(key);
        calculate(input);
        return;
    }
    if (key === ".") {
        highlight(button, false);
        addPoint(key);
        calculate(input);
        return;
    }
    if (key === "Backspace") {
        highlight(button, false);
        removeDigit();
        calculate(input);
        return;
    }
    if (key === "Delete") {
        highlight(button, false);
        clearAll();
        return;
    }
    if (key === "Enter" || key === "=") {
        let equalsBtn = keypad.querySelector(`button[value="="]`);
        highlight(equalsBtn, false);
        input = "" + preview;
        preview = "";
        inputField.innerHTML = input;
        previewField.innerHTML = preview;
        return;
    }
});

