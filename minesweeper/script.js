let width; 
let height; 
let bombs; 
let cellsNumber; 
let bombIndexes;
let cells;
let closedCount; 

function createHeader(){
    const header = document.createElement("HEADER");
    header.classList.add("header");
    const h1 = document.createElement("H1");
    h1.classList.add("title"); 
    h1.textContent = "Welcome to Minesweeper"; 
    header.append(h1); 
    return header; 
}

function createMain(){
    const main = document.createElement("MAIN");
    main.classList.add("main"); 
    const mainDescription = document.createElement("H2");
    mainDescription.classList.add("main-description");
    mainDescription.textContent = "select level of the game 10/10 20/20 30/30";
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
    levels.append(easyButton);
    levels.append(mediumButton);
    levels.append(hardButton);
    main.append(mainDescription);
    main.append(levels);
    easyButton.addEventListener("click", createEasyGame);
    mediumButton.addEventListener("click", createMediumGame);
    hardButton.addEventListener("click", createHardGame);
    return main; 
}

function createFooter(){
    const footer = document.createElement("FOOTER");
    footer.classList.add("footer"); 
    const footerContent = document.createElement("DIV");
    footerContent.classList.add("footer-content");
    const time = document.createElement("H2");
    time.classList.add("footer-text");
    time.textContent = "Time: 00sec";
    const bombsText = document.createElement("H2");
    bombsText.classList.add("footer-text");
    bombsText.textContent = "Bombs left: 30";
    const footerButton = document.createElement("BUTTON"); 
    footerButton.classList.add("btn");
    footerButton.classList.add("text_dark");
    footerButton.classList.add("bg_light");
    footerButton.textContent = "Restart"; 
    footerContent.append(time);
    footerContent.append(bombsText);
    footer.append(footerContent);
    footer.append(footerButton);
    footerButton.addEventListener("click", restartGame);
    return footer;
}

function createBody(){
    const wrapper = document.createElement("DIV");
    wrapper.classList.add("wrapper");
    const header = createHeader();
    const main = createMain();
    const footer = createFooter();
    wrapper.append(header);
    wrapper.append(main);
    wrapper.append(footer);
    document.body.prepend(wrapper); 
}

createBody()

function createGame(w, h, bombs, cellClass, classField) {
    width = w; 
    height = h; 
    bombs = bombs; 
    cellsNumber = width*height; 
    bombIndexes = [...Array(cellsNumber).keys()].sort(() => Math.random() - 0.5).slice(0, bombs);
    closedCount = cellsNumber; 
    const field = document.createElement("DIV");
    field.classList.add("field"); 
    field.classList.add(classField);
    const mainDescription = document.querySelector(".main-description");
    mainDescription.remove();
    const levels = document.querySelector(".level");
    levels.remove();
    const main = document.querySelector(".main");
    main.append(field);
    for(let i = 0; i < cellsNumber; i++) {
        const btn = document.createElement("BUTTON");
        btn.classList.add("cell");
        btn.classList.add(cellClass);
        field.append(btn); 
    }
    cells = [...field.children];
    field.addEventListener("click", minesweeper);
}

function createEasyGame(){
    createGame(10, 10, 10, "cell-small", "field-small")
}

function createMediumGame(){
    createGame(15, 15, 15, "cell-mid", "field-mid")
}

function createHardGame(){
    createGame(25, 25, 25, "cell-big", "field-big")
}

function isValid(row, column){
    return row >= 0 && row < height && column >= 0 && column < width; 
}

function restartGame(){
    const oldMain = document.querySelector(".main");
    const newMain = createMain();
    oldMain.replaceWith(newMain)
}

function isBomb(row, column) {
    if(!isValid(row, column)) return; 
    const clickedIndex = row * width + column;
    return bombIndexes.includes(clickedIndex); 
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
        alert("you lose");
        return; 
    }

    closedCount--;
    if(closedCount <= bombs) {
        alert("you win");
        return; 
    }
    const count = getCount(row, column); 
    if(count !== 0){ 
        cell.textContent = count;
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
    const column = clickIndex % width; 
    const row = Math.floor(clickIndex / width); 
    open(row, column);
}