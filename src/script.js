// 1 = clubs
// 2 = diamonds
// 3 = hearts
// 4 = spades
let list = []
const table = document.getElementById("table")
const holder = document.getElementById("holder")
const panel_content = document.getElementById("panel-content")
let hold = 0 // kartu urutan berapa yang mau diisi

const sampleSize = ([...arr], n = 1) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr.slice(0, n);
};

for(let i=1;i<=13;i++){
    for(let j=1;j<=4;j++){
        list.push(`${i}_${j}`)
    }
}

const cards = sampleSize(list,15)
let card_el = ""
const card_holder = {}

cards.forEach((i,index) => {
    card_holder[index+1] = "-"
    card_el += `<img class="card" src="cards/back.png" id="card-el-${i}"/>`
})
table.innerHTML = card_el

const updateHold = () => {
    let card_holder_el = ""
    // update untuk card holder
    for (const [key, value] of Object.entries(card_holder)) {
        let src = value == "-" ? "card-base.png" : `${value}.svg`
        card_holder_el += `<div class="card-hold" id="card-hold-${key}" onclick="selectCard(${key})" >
            <img src="cards/${src}" disabled/>
            <span>${key}</span>
        </div>`
    }
    holder.innerHTML = card_holder_el
}
updateHold()

let updatePanel = (option) => {
    // update untuk panel 
    let new_element = ""
    for(let i=1;i<=13;i++){
        let disabled = ""
        if(Object.values(card_holder).includes(`${i}_${option}`)){
            disabled = " disabled"
        }
        new_element += `<button class="panel-card${disabled}" onclick="holdCard('${i}_${option}')" ${disabled}>
            <img src="cards/${i}_${option}.svg"/>
        </button>`
    }
    panel_content.innerHTML = new_element
}

const showClosePanel = () => {
    document.getElementById('panel').classList.toggle('hide')
}

const selectCard = (i) => {
    // memilih kartu urutan berapa yang mau diisii
    hold = i // ganti urutan kartu yang mau diisi
    showClosePanel()
    // kembalikan option ke awal (club)
    let el = document.getElementsByClassName('option')[0]
    let last_select = document.getElementsByClassName('select-option')[0]
    last_select.classList.toggle('select-option')
    el.classList.toggle("select-option");
    // update isi panel
    updatePanel(1)
}

const holdCard = (i) => {
    // kartu apa yang mau dipilih
    card_holder[hold] = i 
    // update card holder
    updateHold()
    // update isi panel
    updatePanel(i.split("_")[1])
}

let option = (el) => {
    let last_select = document.getElementsByClassName('select-option')[0]
    last_select.classList.toggle('select-option')
    el.classList.toggle("select-option");
    let option = el.children[0].getAttribute('alt')
    if(option == "clubs") option = 1
    if(option == "diamonds") option = 2
    if(option == "hearts") option = 3
    if(option == "spades") option = 4
    updatePanel(option)
}


