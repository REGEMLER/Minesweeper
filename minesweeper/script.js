const field = document.getElementById("field");

for(let i = 0; i < 100; i++) {
    const btn = document.createElement("BUTTON");
    btn.classList.add("cell-small");
    field.append(btn); 
}

let width = 10; 
let height = 10; 
let bombs = 10; 
let cellsNumber = width*height; 
let bombIndexes = [...Array(cellsNumber).keys()].sort(() => Math.random() - 0.5).slice(0, bombs);
let cells = [...field.children];
let closedCount = cellsNumber; 

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

field.addEventListener("click", handler);