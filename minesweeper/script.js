function createBody(){
    const wrapper = document.createElement("DIV");
    wrapper.classList.add("wrapper");

    const header = document.createElement("HEADER");
    header.classList.add("header");
    const h1 = document.createElement("H1");
    h1.classList.add("title"); 
    h1.textContent = "Welcome to Minesweeper"; 
    header.append(h1); 

    const main = document.createElement("MAIN");
    main.classList.add("main"); 
    const mainDescription = document.createElement("H2");
    mainDescription.classList.add("footer-text");
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

    const footer = document.createElement("FOOTER");
    footer.classList.add("footer"); 
    const footerContent = document.createElement("DIV");
    footerContent.classList.add("footer-content");
    const time = document.createElement("H2");
    time.classList.add("footer-text");
    time.textContent = "Time: 00sec";
    const bombs = document.createElement("H2");
    bombs.classList.add("footer-text");
    bombs.textContent = "Bombs left: 30";
    const footerButton = document.createElement("BUTTON"); 
    footerButton.classList.add("btn");
    footerButton.classList.add("text_dark");
    footerButton.classList.add("bg_light");
    footerButton.textContent = "Restart"; 
    footerContent.append(time);
    footerContent.append(bombs);
    footer.append(footerContent);
    footer.append(footerButton);

    wrapper.append(header);
    wrapper.append(main);
    wrapper.append(footer);
    document.body.prepend(wrapper); 
}

createBody()


// const field = document.getElementById("field");

// for(let i = 0; i < 100; i++) {
//     const btn = document.createElement("BUTTON");
//     btn.classList.add("cell-small");
//     field.append(btn); 
// }

// let width = 10; 
// let height = 10; 
// let bombs = 10; 
// let cellsNumber = width*height; 
// let bombIndexes = [...Array(cellsNumber).keys()].sort(() => Math.random() - 0.5).slice(0, bombs);
// let cells = [...field.children];
// let closedCount = cellsNumber; 

function isValid(row, column){
    return row >= 0 && row < height && column >= 0 && column < width; 
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


function handler(event) {
    if(event.target.tagName !== "BUTTON") {
        return; 
    }
    const clickIndex = cells.indexOf(event.target); 
    const column = clickIndex % width; 
    const row = Math.floor(clickIndex / width); 
    open(row, column);
}

// field.addEventListener("click", handler);