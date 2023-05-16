// Глобальные переменные 
let width = 10; 
let height = 10; 
let bombs = 10; 
let amountOfCells = width*height; 
let bombIndexesArray = [];
let cells = [];
let step = 0;
let seconds = 0;
let closedCells = amountOfCells; 
let isDarkTheme = false; 
let timerId = null; 
let latestResults; 
let isSaved = "";

// LocalStorage
const setLocalStorage = () => {
    localStorage.setItem("latestResults", latestResults);
}

const getLocalStorage = () => {
    if (localStorage.getItem('latestResults')) {
        latestResults = localStorage.getItem('latestResults');
    } else {
        latestResults = ""; 
    }
    const list = createResults();
    document.body.append(list); 
    list.addEventListener("click", () => {
        list.classList.remove("results-visible"); 
    })
    if(localStorage.getItem('isSaved')){
        loadGame()
    }
}

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

// Создание разметки 
function createHeader(){
    const header = document.createElement("HEADER");
    header.classList.add("header");
    const h1 = document.createElement("H1");
    h1.className = "title text";
    h1.textContent = "Welcome to Minesweeper"; 
    header.append(h1); 
    return header; 
}

function createMain(){
    const main = document.createElement("MAIN");
    main.classList.add("main"); 

    const field = createGame(10, 10, 10, "cell-small", "field-small");

    const mainContainer = document.createElement("DIV");
    mainContainer.classList.add("main-container")
    const mainDescription = document.createElement("H2");
    mainDescription.className = "main-description text";
    mainDescription.textContent = "Select level and the number of bombs";
    const levels = document.createElement("DIV");
    levels.classList.add("level");
    const easyButton = document.createElement("BUTTON"); 
    easyButton.className = "btn bg_dark text_light";
    easyButton.textContent = "Easy";
    const mediumButton = document.createElement("BUTTON"); 
    mediumButton.className = "btn bg_dark text_light";
    mediumButton.textContent = "Medium";
    const hardButton = document.createElement("BUTTON"); 
    hardButton.className = "btn bg_dark text_light";
    hardButton.textContent = "Hard";
    const inputBombs = document.createElement("INPUT");
    inputBombs.setAttribute("type", "number");
    inputBombs.setAttribute("placeholder", "bombs");
    inputBombs.className = "input-bombs bg_dark text_light";

    levels.append(easyButton, mediumButton, hardButton, inputBombs);
    mainContainer.append(mainDescription, levels);
    main.append(mainContainer, field);

    levels.addEventListener("click", changeLevel);
    return main; 
}

function createFooter(){
    const footer = document.createElement("FOOTER");
    footer.classList.add("footer"); 
    const footerContent = document.createElement("DIV");
    footerContent.classList.add("footer-content");
    const time = document.createElement("H2");
    time.className = "footer-text text";
    time.textContent = `Time: ${seconds} sec`;
    time.id = "time";
    const bombsText = document.createElement("H2");
    bombsText.className = "footer-text text";
    bombsText.textContent = `Bombs left: ${bombs}`;
    bombsText.id = "bombsText";
    const clicks = document.createElement("H2");
    clicks.className = "footer-text text";
    clicks.textContent = `Clicks: ${step}`;
    clicks.id = "clicks";
    const footerButtons = document.createElement("DIV");
    footerButtons.classList.add("footer-buttons");
    const footerButton1 = document.createElement("BUTTON"); 
    footerButton1.className = "btn bg_dark text_light";
    footerButton1.textContent = "Restart"; 
    const footerButton2 = document.createElement("BUTTON"); 
    footerButton2.className = "btn bg_dark text_light";
    footerButton2.textContent = "Last 10"; 
    const footerButton3 = document.createElement("BUTTON"); 
    footerButton3.className = "btn bg_dark text_light";
    footerButton3.textContent = "Save"; 

    footerButtons.append(footerButton1, footerButton2, footerButton3);
    footerContent.append(time, clicks, bombsText);
    footer.append(footerContent, footerButtons);

    footerButton1.addEventListener("click", restartGame);
    footerButton2.addEventListener("click", () => {
        const results = document.querySelector(".results"); 
        results.classList.add("results-visible"); 
    });
    footerButton3.addEventListener("click", saveGame);

    return footer;
}

function createResults(){
    const list = document.createElement("UL");
    list.classList.add("results");
    for(let i = 0; i < 10; i++){
        const li = document.createElement("LI");
        li.classList.add("text");
        list.append(li);
    }
    let arr = latestResults.split(";");
    arr.forEach((item, index) => {
        if(item == "") return; 
        list.children[index].textContent = `${index + 1}) ${item}`
    })
    return list; 
}

function createBody(){
    const wrapper = document.createElement("DIV");
    wrapper.classList.add("wrapper");
    const theme = document.createElement("DIV");
    const img = document.createElement("IMG");
    img.src = "free-icon-sun-5903519.png";
    theme.classList.add("theme"); 
    theme.append(img);

    const header = createHeader();
    const main = createMain();
    const footer = createFooter();
    
    wrapper.append(header, main, footer);
    document.body.prepend(wrapper, theme); 

    theme.addEventListener("click", toggleTheme);
}

createBody();

// Создание поля игры 
function createGame(w, h, b, cellClass, classField) {
    width = w; 
    height = h; 
    bombs = b; 
    amountOfCells = width*height; 
    closedCells = amountOfCells; 
    step = 0;
    const field = document.createElement("DIV");
    field.classList.add("field"); 
    field.classList.add(classField);
    for(let i = 0; i < amountOfCells; i++) {
        const btn = document.createElement("BUTTON");
        btn.classList.add("cell");
        btn.classList.add(cellClass);
        field.append(btn); 
    }
    if(cells.length) cells.length = 0; 
    cells = [...field.children];

    field.addEventListener("click", minesweeper);
    field.addEventListener("contextmenu", markBomb);

    timerId = setInterval(() => {
        const time = document.getElementById("time");
        seconds++
        time.textContent = `Time: ${seconds} sec`;
    }, 1000);
    return field; 
}

// Изменение уровня или перезапуск игры 
function changeLevel(event){
    if(event.target.tagName !== "BUTTON"){
        return;
    }
    setLevel(event.target.textContent);
}

function restartGame(){
    const field = document.querySelector(".field");
    const level = field.classList[1];
    setLevel(level);
}

function setLevel(level){
    stopTimer();
    const field = document.querySelector(".field");
    let inputBombs = document.querySelector(".input-bombs").value; 
    let newField;
    if(inputBombs && (inputBombs < 10 || inputBombs > 99)){
        createModal("Number of bombs must be in range from 10 to 99!");
        return;
    }
    if(level ==="Easy" || level === "field-small"){
        bombs = inputBombs ? +inputBombs : 10;
        newField =  createGame(10, 10, bombs, "cell-small", "field-small");
    } else if(level === "Hard" || level === "field-big"){
        bombs = inputBombs ? +inputBombs : 25;
        newField = createGame(25, 25, bombs, "cell-big", "field-big");
    } else {
        bombs = inputBombs ? +inputBombs : 15;
        newField = createGame(15, 15, bombs, "cell-mid", "field-mid");
    }
    const clicks = document.getElementById("clicks");
    clicks.textContent = `Clicks: ${step}`;
    const bombsText = document.getElementById("bombsText");
    bombsText.textContent = `Bombs left: ${bombs}`;
    field.replaceWith(newField);
    sound("start.mp3");
    isSaved = "";
    localStorage.removeItem("isSaved");
}

// Функции и дополнительные функции которые срабатывают при ЛКМ или ПКМ
function isValid(row, column){
    return row >= 0 && row < height && column >= 0 && column < width; 
}

function isBomb(row, column) {
    if(!isValid(row, column)) return; 
    const clickedIndex = row * width + column;
    return bombIndexesArray.includes(clickedIndex); 
}

function getCount(row, column) {
    let count = 0; 
    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++){
            if(isBomb(row + j, column + i)) {
                count++; 
            }
        }
    }
    return count; 
}

function win(){
    setResult();
    createModal(`Hooray! You found all mines in ${seconds} seconds and ${step} moves!`, true);
    const field = document.querySelector(".field");
    field.removeEventListener("click", minesweeper);
    field.removeEventListener("contextmenu", markBomb);
    sound("win.mp3");
    stopTimer();
    isSaved = "";
    localStorage.removeItem("isSaved");
}

function lose(cell){
    cell.textContent = "💣";
    cell.classList.add("bomb");
    createModal(`Game over! You lose! Try again!`);
    const field = document.querySelector(".field");
    field.removeEventListener("click", minesweeper);
    field.removeEventListener("contextmenu", markBomb);
    sound("lose.mp3");
    stopTimer();
    isSaved = "";
    localStorage.removeItem("isSaved");
    cells.forEach((item, index) => {
        if(bombIndexesArray.includes(index)){
            if(item.dataset.flag === "on"){
                item.classList.add("destroyed-bomb")
            }
            item.textContent = "💣";
        } 
    })
}

function open(row, column) {
    if(!isValid(row, column)) return; 

    const clickedIndex = row * width + column;
    const cell = cells[clickedIndex]; 

    if(cell.disabled === true || cell.dataset.flag === "on") return;

    cell.disabled = true;
    if(isBomb(row, column)){
        lose(cell);
        return; 
    }

    closedCells--;
    if(closedCells <= bombs) {
        win();
        return; 
    }
    const count = getCount(row, column); 
    if(count !== 0){ 
        cell.textContent = count;
        if(count === 1) {
            cell.classList.add("cell-1");
        } else if(count === 2) {
            cell.classList.add("cell-2");
        } else if (count === 3){
            cell.classList.add("cell-3");
        } else if(count === 4){
            cell.classList.add("cell-4");
        }
        return; 
    }
    for(let i = -1; i <= 1; i++) {
        for(let j = -1; j <= 1; j++){
            open(row + j, column + i)
        }
    }
}

function minesweeper(event) {
    if(event.target.tagName !== "BUTTON" || event.target.disabled === true || event.target.dataset.flag === "on") {
        return; 
    }
    sound("click.mp3");
    const clickIndex = cells.indexOf(event.target); 
    if(step === 0){
        if( bombIndexesArray.length) bombIndexesArray.length = 0; 
        const arrWithoutFirstClick = [...Array(amountOfCells).keys()];
        arrWithoutFirstClick.splice(clickIndex, 1);
        bombIndexesArray = arrWithoutFirstClick.sort(() => Math.random() - 0.5).slice(0, bombs);
    }
    const column = clickIndex % width; 
    const row = Math.floor(clickIndex / width); 
    step++;
    open(row, column);
    const clicks = document.getElementById("clicks");
    clicks.textContent = `Clicks: ${step}`;
}

function markBomb(event){
    if(event.target.tagName !== "BUTTON") {
        return; 
    }
    event.preventDefault();
    const clickIndex = cells.indexOf(event.target); 
    const cell = cells[clickIndex]; 
    if(cell.disabled === true) {
        return; 
    }
    if( cell.dataset.flag !== "on"){
        sound("flag.mp3");
        cell.textContent = "🚩";
        cell.classList.add("cell-mark");
        bombs--;
        const bombsText = document.getElementById("bombsText");
        bombsText.textContent = `Bombs left: ${bombs}`;
        cell.dataset.flag = "on";
    } else {
        sound("flag.mp3");
        cell.textContent = "";
        cell.classList.remove("cell-mark");
        bombs++;
        const bombsText = document.getElementById("bombsText");
        bombsText.textContent = `Bombs left: ${bombs}`;
        cell.dataset.flag = "";
    }
}

//Дополнительные функции и модальные окна 
function toggleTheme(){
    const icon = document.querySelector(".theme");
    const btns = [...document.querySelectorAll(".btn")];
    const texts = [...document.querySelectorAll(".text")];
    const input = document.querySelector(".input-bombs");
    const results = document.querySelector(".results")
    if(isDarkTheme){
        document.body.style.backgroundColor = "#7e86b4";
        results.classList.remove("results-dark");
        results.classList.remove("results-white-text");
        input.classList.remove("bg_light");
        input.classList.add("bg_dark");
        input.classList.remove("text_dark");
        input.classList.add("text_light");
        btns.forEach(item => {
            item.classList.remove("text_dark");
            item.classList.add("text_light");
            item.classList.remove("bg_light");
            item.classList.add("bg_dark");
        })
        texts.forEach(item => {
            item.classList.add("text_dark");
            item.classList.remove("text_light");
        })
        isDarkTheme = false;
        icon.firstElementChild.src = "free-icon-sun-5903519.png";
    } else {
        document.body.style.backgroundColor = "#232529";
        results.classList.add("results-dark");
        results.classList.add("results-white-text");
        input.classList.add("bg_light");
        input.classList.remove("bg_dark");
        input.classList.add("text_dark");
        input.classList.remove("text_light");
        btns.forEach(item => {
            item.classList.add("text_dark");
            item.classList.remove("text_light");
            item.classList.add("bg_light");
            item.classList.remove("bg_dark");
        })
        texts.forEach(item => {
            item.classList.remove("text_dark");
            item.classList.add("text_light");
        })
        isDarkTheme = true;
        icon.firstElementChild.src = "free-icon-moon-4139157.png";
    }
}

function stopTimer(){
    clearInterval(timerId);
    const time = document.getElementById("time");
    seconds = 0;
    time.textContent = `Time: ${seconds} sec`;
}

function createModal(text, isGood){
    const modal = document.createElement("DIV");
    modal.classList.add("modal");
    modal.textContent = text;
    const X = document.createElement("SPAN");
    X.textContent = "X";
    X.classList.add("modal-x");
    modal.append(X);
    if(isGood){
        modal.classList.add("modal_good");
    } else {
        modal.classList.add("modal_bad");
    }
    document.body.append(modal);
    document.body.style.overflow = "hidden";
    const wrapper = document.querySelector(".wrapper");
    wrapper.style.opacity = "0.5";
    modal.addEventListener("click", () => {
        modal.remove();
        document.body.style.overflow = "";
        const wrapper = document.querySelector(".wrapper");
        wrapper.style.opacity = "1";
    })
}

function sound(src){
    const audio = new Audio();
    audio.src = src;
    audio.play(); 
}

function setResult(){
    const date = new Date();
    const time = date.toLocaleString();
    let stringResult = `${time} - You win for ${step} cliks and ${seconds} seconds;`;; 
    latestResults += stringResult; 
    let arr = latestResults.split(";");
    if(arr[0] == "") arr.shift(); 
    if(arr.length > 11){
        arr.shift(); 
    }
    const results = document.querySelector(".results"); 
    arr.forEach((item, index) => {
        if(item == "") return; 
        results.children[index].textContent = `${index + 1}) ${item}`;
    });
    latestResults = "";
    let newString = arr.join(";");
    latestResults = newString;
}

function saveGame(){
    let localWidth = width; 
    let localHeight = height; 
    let localBombs = bombs; 
    let localBombIndexesArray = [...bombIndexesArray].join(",");
    let localStep = step;
    let localSeconds = seconds;
    let localField = document.querySelector(".field").innerHTML; 
    let localClosedCells = closedCells;
    localStorage.setItem("localWidth", localWidth);
    localStorage.setItem("localHeight", localHeight);
    localStorage.setItem("localBombs", localBombs);
    localStorage.setItem("localBombIndexesArray", localBombIndexesArray);
    localStorage.setItem("localStep", localStep);
    localStorage.setItem("localSeconds", localSeconds);
    localStorage.setItem("localField", localField);
    localStorage.setItem("localClosedCells", localClosedCells);
    localStorage.setItem("isSaved", true);
    createModal("Saved! The game will be loaded after reloading the page", true);
    sound("flag.mp3");
}

function loadGame(){
    clearInterval(timerId);
    width = localStorage.getItem('localWidth'); 
    height = localStorage.getItem('localHeight'); 
    bombs = localStorage.getItem('localBombs'); 
    amountOfCells = width*height; 
    let tempArr = localStorage.getItem('localBombIndexesArray').split(","); 
    bombIndexesArray = tempArr.map(item => +item); 
    step = localStorage.getItem('localStep'); 
    seconds = localStorage.getItem('localSeconds'); 
    const field = document.querySelector(".field"); 
    field.innerHTML = localStorage.getItem('localField'); 
    closedCells = localStorage.getItem('localClosedCells'); 
    cells = [...field.children];
    const time = document.getElementById("time");
    time.textContent = `Time: ${seconds} sec`;
    const bombsText = document.getElementById("bombsText");
    bombsText.textContent = `Bombs left: ${bombs}`;
    const clicks = document.getElementById("clicks");
    clicks.textContent = `Clicks: ${step}`;
    timerId = setInterval(() => {
        const time = document.getElementById("time");
        seconds++
        time.textContent = `Time: ${seconds} sec`;
    }, 1000);
}
