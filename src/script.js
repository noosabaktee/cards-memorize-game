// 1 = clubs
// 2 = diamonds
// 3 = hearts
// 4 = spades

if (localStorage.getItem("score") == null) localStorage.setItem("score",0)

let list = []
const table = document.getElementById("table")
const holder = document.getElementById("holder")
const panel_content = document.getElementById("panel-content")
const nextBtn = document.getElementById("nextBtn")
const playBtn = document.getElementById("playBtn")
const submitBtn = document.getElementById("submitBtn")
const restartBtn = document.getElementById("restartBtn")
let hold = 0 // kartu urutan berapa yang mau diisi
let minutes = 0
let seconds = 10
let timerMemorize, timerHold

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

let cards
let card_holder = {}

let updateTable = () => {
    card_holder = {}
    table.classList.toggle('animate__bounceInDown')
    let new_element = ""
    let level = document.getElementById("level").value
    if(level == "easy") cards = sampleSize(list,20)
    if(level == "medium") cards = sampleSize(list,35)
    if(level == "hard") cards = sampleSize(list,52)
    cards.forEach((i,index) => {
        card_holder[index+1] = "-"
        new_element += `<img class="card animate__animated" src="cards/back.png" id="card-el-${i}"/>`
    })
    table.innerHTML = new_element    
}
updateTable()

let updateLevel = () => {
    deleteAnim()
    table.classList.toggle('animate__bounceOutUp')
    setTimeout(function(){
        table.classList.toggle('animate__bounceOutUp')
        updateTable()
    }, 1000);
}

const updateHold = () => {
    let card_holder_el = ""
    // update untuk card holder
    for (const [key, value] of Object.entries(card_holder)) {
        let src = value == "-" ? "card-base.png" : `${value}.svg`
        card_holder_el += `<div class="card-hold" onclick="selectCard(${key})" >
            <img class="animate__animated" id="card-hold-${key}"  src="cards/${src}" disabled/>
            <span>${key}</span>
        </div>`
    }
    holder.innerHTML = card_holder_el
}

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
const showClosePopup = () => {
    document.getElementById('popup').classList.toggle('hide')
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

let flipCard = (i) => {
    if(i > cards.length-1) {
        updateHold()
        return false
    }
    const cardOpen = document.getElementsByClassName('card')[i]
    cardOpen.classList.toggle('animate__flipInY')
    cardOpen.src = `cards/${cards[i]}.svg`
    setTimeout(function(){
        flipCard(i+1)
    }, 100);
}

let checkCard = (i) => {
    if(i > cards.length-1){
        return false
    }
    let answer = cards[i] == card_holder[i+1] ? "correct" : "wrong"
    const cardOpen = document.getElementById(`card-hold-${i+1}`)
    if(answer == "wrong") cardOpen.classList.toggle('animate__tada')
    else cardOpen.classList.toggle('animate__bounce')
    cardOpen.classList.toggle(answer)
    setTimeout(function(){
        checkCard(i+1)
    }, 100);
}

let start = () => {
    playBtn.classList.toggle("hide")
    timerMemorize = setInterval(() => {
        countDown("memorize")
    }, 1000)
    nextBtn.classList.toggle("hide")
    showClosePopup()
    flipCard(0)
}

let startHold = () => {
    clearAllInterval()
    timerHold = setInterval(() => {
        countDown("hold")
    }, 1000)
    nextBtn.classList.toggle("hide")
    submitBtn.classList.toggle("hide")
    deleteAnim()
    table.classList.toggle('animate__bounceOutUp')
    setTimeout(function(){
        table.classList.toggle('hide')
        holder.classList.toggle('hide')
        holder.classList.toggle('animate__bounceInDown')
    }, 1000);
}

let restart = () => {
    playBtn.classList.toggle("hide")
    restartBtn.classList.toggle("hide")
    cards = []
    card_holder = {}
    holder.classList.toggle('animate__bounceOutUp')
    setTimeout(function(){
        showClosePopup()
        holder.classList.toggle('hide')
        table.classList.toggle('hide')
        deleteAnim()
        updateTable()
    }, 1000);
}

let submit = () => {
    submitBtn.classList.toggle("hide")
    restartBtn.classList.toggle("hide")
    if(Object.values(card_holder).includes("-")){
        console.log("masih ada yang kosong")
    }
    checkCard(0)
}

let deleteAnim = () => {
    table.classList.remove('animate__bounceOutUp')
    table.classList.remove('animate__bounceInDown')
    holder.classList.remove('animate__bounceOutUp')
    holder.classList.remove('animate__bounceInDown')    
}

let countDown = (info) => {
    seconds--
    if(seconds < 0){
        minutes--
        seconds = 10
    }
    document.getElementById("minutes").innerHTML = minutes.toString().length > 1 ? minutes : "0" + minutes
    document.getElementById("seconds").innerHTML = seconds.toString().length > 1 ? seconds : "0" + seconds
    if(minutes <= 0 && seconds <= 0){
        clearAllInterval()
        if(info == "memorize"){
            startHold()
        }else{
            submit()
        }
    }
}

let clearAllInterval = () => {
    seconds = 10
    clearInterval(timerMemorize)
    clearInterval(timerHold)
}