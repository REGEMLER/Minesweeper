let width = 10; 
let height = 10; 
let bombs = 10; 
let amountOfCells = width*height; 
let bombIndexesArray = [];
let cells = [];
let step = 0;
let seconds = 0;
let closedCells = amountOfCells; 
let isDarkTheme = true; 
let timerId = null; 

function createHeader(){
    const header = document.createElement("HEADER");
    header.classList.add("header");
    const h1 = document.createElement("H1");
    h1.classList.add("title"); 
    h1.classList.add("text"); 
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
    mainDescription.classList.add("main-description");
    mainDescription.classList.add("text");
    mainDescription.textContent = "Select level and the number of bombs";
    const levels = document.createElement("DIV");
    levels.classList.add("level");
    const easyButton = document.createElement("BUTTON"); 
    easyButton.classList.add("btn");
    easyButton.textContent = "Easy";
    const mediumButton = document.createElement("BUTTON"); 
    mediumButton.classList.add("btn");
    mediumButton.textContent = "Medium";
    const hardButton = document.createElement("BUTTON"); 
    hardButton.classList.add("btn");
    hardButton.textContent = "Hard";
    const inputBombs = document.createElement("INPUT");
    inputBombs.setAttribute("type", "number");
    inputBombs.setAttribute("placeholder", "bombs");
    inputBombs.classList.add("input-bombs");
    inputBombs.value = "10";
    levels.append(easyButton);
    levels.append(mediumButton);
    levels.append(hardButton);
    levels.append(inputBombs);
    mainContainer.append(mainDescription);
    mainContainer.append(levels);
    main.append(mainContainer);
    main.append(field);
    levels.addEventListener("click", changeLevel);
    return main; 
}

function createFooter(){
    const footer = document.createElement("FOOTER");
    footer.classList.add("footer"); 
    const footerContent = document.createElement("DIV");
    footerContent.classList.add("footer-content");
    const time = document.createElement("H2");
    time.classList.add("footer-text");
    time.classList.add("text");
    time.textContent = `Time: ${seconds} sec`;
    time.id = "time";
    const bombsText = document.createElement("H2");
    bombsText.classList.add("footer-text");
    bombsText.classList.add("text");
    bombsText.textContent = `Bombs left: ${bombs}`;
    bombsText.id = "bombsText";
    const clicks = document.createElement("H2");
    clicks.classList.add("footer-text");
    clicks.classList.add("text");
    clicks.textContent = `Clicks: ${step}`;
    clicks.id = "clicks";
    const footerButton = document.createElement("BUTTON"); 
    footerButton.classList.add("btn");
    footerButton.textContent = "Restart"; 
    footerContent.append(time);
    footerContent.append(clicks);
    footerContent.append(bombsText);
    footer.append(footerContent);
    footer.append(footerButton);
    footerButton.addEventListener("click", restartGame);
    return footer;
}

function createBody(){
    const wrapper = document.createElement("DIV");
    wrapper.classList.add("wrapper");
    const theme = document.createElement("DIV");
    const img = document.createElement("IMG");
    img.src = "free-icon-sun-5903519.png";
    theme.classList.add("theme"); 
    theme.append(img);
    theme.addEventListener("click", toggleTheme)
    const header = createHeader();
    const main = createMain();
    const footer = createFooter();
    wrapper.append(header);
    wrapper.append(main);
    wrapper.append(footer);
    document.body.prepend(wrapper); 
    document.body.prepend(theme); 
    toggleTheme()
}

createBody()

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
    timerId = setInterval(() => {
        const time = document.getElementById("time");
        seconds++
        time.textContent = `Time: ${seconds} sec`;
    }, 1000);
    return field; 
}

function changeLevel(event){
    if(event.target.tagName !== "BUTTON"){
        return;
    }
    let inputBombs = document.querySelector(".input-bombs").value; 
    let newField;
    stopTimer()
    if(!inputBombs){
        if(event.target.textContent ==="Easy"){
            newField =  createGame(10, 10, 10, "cell-small", "field-small");
        } else if(event.target.textContent ==="Hard"){
            newField = createGame(25, 25, 25, "cell-big", "field-big");
        } else {
            newField = createGame(15, 15, 15, "cell-mid", "field-mid");
        }
    } else {
        if(inputBombs < 10 || inputBombs > 99){
            createModal("Number of bombs must be in range from 10 to 99!")
            return
        }
        bombs = +inputBombs;
        if(event.target.textContent ==="Easy"){
            newField =  createGame(10, 10, bombs, "cell-small", "field-small");
        } else if(event.target.textContent ==="Hard"){
            newField = createGame(25, 25, bombs, "cell-big", "field-big");
        } else {
            newField = createGame(15, 15, bombs, "cell-mid", "field-mid");
        }
    }
    const clicks = document.getElementById("clicks");
    clicks.textContent = `Clicks: ${step}`;
    const bombsText = document.getElementById("bombsText");
    bombsText.textContent = `Bombs left: ${bombs}`;
    const oldField = document.querySelector(".field");
    oldField.replaceWith(newField);
}

function createModal(text, isGood){
    const modal = document.createElement("DIV");
    modal.classList.add("modal");
    modal.textContent = text;
    if(isGood){
        modal.classList.add("modal_good");
    } else {
        modal.classList.add("modal_bad");
    }
    document.body.append(modal);
    modal.addEventListener("click", () => {
        modal.remove();
    })
}

function stopTimer(){
    clearInterval(timerId);
    const time = document.getElementById("time");
    seconds = 0;
    time.textContent = `Time: ${seconds} sec`;
}

function isValid(row, column){
    return row >= 0 && row < height && column >= 0 && column < width; 
}

function restartGame(){
    stopTimer();
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

function open(row, column) {
    if(!isValid(row, column)) return; 

    const clickedIndex = row * width + column;
    const cell = cells[clickedIndex]; 

    if(cell.disabled === true) return;

    cell.disabled = true;
    if(isBomb(row, column)){
        cell.textContent = "💣";
        cell.classList.add("bomb");
        stopTimer();
        createModal(`Game over! You lose! Try again!`);
        return; 
    }

    closedCells--;
    if(closedCells <= bombs) {
        stopTimer();
        createModal(`Game over! You win for ${seconds} seconds and ${step} times!`, true);
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
    if(event.target.tagName !== "BUTTON") {
        return; 
    }
    const clickIndex = cells.indexOf(event.target); 
    if(step === 0){
        if( bombIndexesArray.length) bombIndexesArray.length = 0; 
        const arrWithoutFirstClick = [...Array(amountOfCells).keys()];
        arrWithoutFirstClick.splice(clickIndex, 1);
        bombIndexesArray = arrWithoutFirstClick.sort(() => Math.random() - 0.5).slice(0, bombs);
    }
    const column = clickIndex % width; 
    const row = Math.floor(clickIndex / width); 
    open(row, column);
    step++;
    const clicks = document.getElementById("clicks");
    clicks.textContent = `Clicks: ${step}`;
}

function toggleTheme(){
    const icon = document.querySelector(".theme");
    const btns = [...document.querySelectorAll(".btn")];
    const texts = [...document.querySelectorAll(".text")];
    const input = document.querySelector(".input-bombs");
    if(isDarkTheme){
        document.body.style.backgroundColor = "#7e86b4";
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