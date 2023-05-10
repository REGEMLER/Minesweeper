const field = document.getElementById("field");

for(let i = 0; i < 100; i++) {
    const btn = document.createElement("BUTTON");
    btn.classList.add("cell-mid");
    field.append(btn); 
}