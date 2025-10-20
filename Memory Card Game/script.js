const gameBoard = document.getElementById('gameBoard');

const emojis = ['🍎', '🍎', '🍓', '🍓', '🍉', '🍉', '🍒', '🍒'];

emojis.sort(() => Math.random() - 0.5);

emojis.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<div class="front">${emoji}</div>
                    <div class="back"></div>`;
    gameBoard.appendChild(card);

});

let flippedCards = [];
let lockBoard = false;

gameBoard.addEventListener('click', (e)=>{
    const clicked= e.target.closest('.card');
    if (!clicked || lockBoard || clicked.classList.contains('flip')) return;
    clicked.classList.add('flip');
    flippedCards.push(clicked);
    if(flippedCards.length===2){
        checkMatch();
    }
});

function checkMatch(){
    const[card1, card2]=flippedCards;
    const isMatch= card1.innerHTML === card2.innerHTML;

    if(isMatch){
        flippedCards=[];
    }else{
        lockBoard=true;
        setTimeout(()=>{
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            flippedCards=[];
            lockBoard=false;
        },800);
    }
}