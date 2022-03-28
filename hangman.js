let word; 
let wordDescription;
let wordArray;
let guessedLetters = [];
let wrongGuessedLetters = [];
let guessOpportunities = 6;
let lettersLeftToGuess = [];
let wordDescriptionHtml = document.getElementById('description');
let chancesLeftDisplay =  document.getElementById('chancesLeft');
let letterGuess = document.getElementById('letter');
let wordDisplay = document.getElementById('displayedWord');
let restartButton = document.getElementsByClassName('restart-button')[0];
let wrongLettersContainer = document.getElementById('wrongLetters');
let loadingMessage = document.getElementsByClassName('loading-text')[0];
wordDescriptionHtml.style.display = 'none';

let setupGame = () => {   
    document.getElementsByClassName('kid')[0].style.visibility = 'visible';
    document.getElementsByClassName('rope')[0].style.visibility = 'visible';
    document.getElementsByClassName('saved-svg')[0].style.visibility = 'hidden';
    document.getElementsByClassName('chancesLeftText')[0].style.display = 'block';
    document.getElementsByClassName('win-message')[0].style.display = 'none';

    if(word != undefined) {
        wordArray = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split('');
        lettersLeftToGuess = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split('');

        wordArray.forEach((item) => {
            let element = document.createElement('span');

            if(item == ' ') {
                element.className = 'space' 
            } else {
                element.className = 'underline'
            }
            
            wordDisplay.appendChild(element);
        });

        letterGuess.addEventListener('input', checkLetter);
        restartButton.addEventListener('click',resetGame);
        updateChances();
    }
}

let checkLetter = (e) => {
    let selectedLetter = e.target.value.toLowerCase();

    let isRepeatedGuess = guessedLetters.includes(selectedLetter);
    let letterIsInWord = wordArray.includes(selectedLetter);

    let helpInfo = document.getElementById('help-info');

    if(helpInfo) {
        helpInfo.remove();
    } 

    //check if repeated
    if (!isRepeatedGuess) {

        //if is not repeated we check if letter is in the word
        if(letterIsInWord) {

        //the letter is in the word array
        //so we push that letter to the guessed array
        guessedLetters.push(selectedLetter);

        wordArray.map((item, idx) => {
           if( item == selectedLetter ) {
               document.getElementById('displayedWord').childNodes[idx].textContent = item;
           
               lettersLeftToGuess = lettersLeftToGuess.filter((item) => {
                return item !== selectedLetter;
               })

               if(lettersLeftToGuess.length == 0) {
                    //win
                    document.getElementsByClassName('kid')[0].style.visibility = 'hidden';
                    document.getElementsByClassName('rope')[0].style.visibility = 'hidden';
                    document.getElementsByClassName('saved-svg')[0].style.visibility = 'visible';

                    document.getElementsByClassName('chancesLeftText')[0].style.display = 'none';
                    document.getElementsByClassName('win-message')[0].style.display = 'block';

                    savedTL.play();

                   letterGuess.disabled = true;
                   restartButton.style.display = 'block';

                   let underlines = document.getElementsByClassName('underline');
                   for(let i = 0; i < underlines.length; i++) {
                        underlines[i].classList.add('win');
                   };
                   showDescription();
               }
           };
        })
        } else {
            //picked letter was incorrect
            //we add the new wrong letter too the wrrong letters array

            //we check if the user already selected this wrrong letterr
            if(!wrongGuessedLetters.includes(selectedLetter)) {
                // if not previous selected we added it 
                wrongGuessedLetters.push(selectedLetter);
                guessOpportunities--;
                
                let selectedWrongLetter = document.createElement('span');
                selectedWrongLetter.className = 'wrong-selected-letter';
                selectedWrongLetter.textContent = selectedLetter;
                selectedWrongLetter.style.transform = 
                "rotate(" + ['', '-'][Math.floor(Math.random() * ['',''].length)] + Math.floor((Math.random() * (5 - 1) + 1)) + "deg)"

                document.getElementById('wrongLetters').appendChild(selectedWrongLetter);

                updateChances();
                wrongLetterTL.play(0);
    
                if(guessOpportunities <= 0) {
                    gameOver();

                    wordArray.map((item, idx) => {
                        let childNode = document.getElementById('displayedWord').childNodes[idx];
                        if(childNode.textContent == '') {
                            childNode.textContent = item;
                            childNode.style.color = "red"
                        }
                    });
                    }
            } else {
                //if wrong selection is repeated
            }
        }

    } else {
        //user already picked same correct onoe
    }

    setTimeout(() => {
        e.target.value = '';
    },200)
}

let gameOver = () => {
    letterGuess.disabled = true;
    showDescription();
    wrongLetterTL.pause();
    deathTL.play(0);
    restartButton.style.display = 'block';
}

let showDescription = () => {
    document.getElementById('description').innerHTML = wordDescription;
    if(wordDescription != '') {
        wordDescriptionHtml.style.display = 'block';
    }
}

//gsap animations
let wrongLetterTL = gsap.timeline({ yoyo : true, repeat: 1, paused: true });
wrongLetterTL.to('.kid-container',{ top: -20 });
wrongLetterTL.to('#mouthPayne1',{ display: 'block'},'<');
wrongLetterTL.to('#mouthClosed',{ opacity: '0' },'<');
wrongLetterTL.to('#feet1',{ transformOrigin:"70% 10%", rotate: -20 }, "<");
wrongLetterTL.to('#feet2',{ transformOrigin:"30% 10%", rotate: 20}, "<");
wrongLetterTL.to('#g30560',{ transformOrigin:"50% 50%", scaleX:0.7}, "<");

let deathTL = gsap.timeline({ paused: true });
deathTL.to('.kid-container',{ duration: 0.8, top: -80 });
deathTL.to('#feet1',{ transformOrigin:"70% 10%", rotate: -50 }, "<");
deathTL.to('#feet2',{ transformOrigin:"30% 10%", rotate: 50}, "<");
deathTL.to('#head',{transformOrigin:"50% 100%", rotate: 20}, "<");
deathTL.to('#g30560',{transformOrigin:"50% 50%", rotate: 10}, "<");
deathTL.to('#g30560',{ transformOrigin:"50% 50%", scaleX:0.55}, "<");
deathTL.to('.kid-container', { transformOrigin:"50% 0%", rotate: 2, repeat: 10, yoyo: true, duration: 3}, Elastic.easeOut);

let loadingTL = gsap.timeline();
loadingTL.to('.fa-hourglass',{rotate: '365deg', stagger: 0.2, duration: 2, repeat: '-1'})

let winMessage = document.querySelectorAll('.win-message span');
let savedTL = gsap.timeline({paused: true});
savedTL.to(winMessage, {
    transform: 'scale(1.5)',
    stagger: 0.2,
    repeat: '-1',
    yoyo: true
})

let winAnimationL= gsap.timeline();
winAnimationL.to('.left-arm',{
    transformOrigin:"90% 90%",
    rotate: '-20deg',
    repeat: '-1',   
    yoyo: true,
    ease:Linear.easeNone
})

let winAnimationR= gsap.timeline();
winAnimationR.to('.rigth-arm',{
    transformOrigin:"10% 90%",
    rotate: '20deg',
    repeat: '-1',
    yoyo: true,
    ease:Linear.easeNone
})

let updateChances = () => {
    chancesLeftDisplay.style.color = 'black';
    chancesLeftDisplay.textContent = guessOpportunities;
    if(guessOpportunities <= 2){
        chancesLeftDisplay.style.color = 'red';
    } 
}

let resetGame = () => {
    deathTL.play(0).pause();
    guessOpportunities = 6;
    wordArray = [];
    guessedLetters = [];
    wrongGuessedLetters = [];
    lettersLeftToGuess = [];
    letterGuess.disabled = false;
    wordDisplay.innerHTML = '';
    wrongLettersContainer.innerHTML = '';
    wordDescriptionHtml.style.display = 'none';
    restartButton.style.display = 'none';
    savedTL.pause();

    updateChances();
    init();
}

const init = () => {
    loadingMessage.style.display = 'block';
    updateChances();

    fetch('https://palabras-aleatorias-public-api.herokuapp.com/random', {

        mode: 'no-cors'

    }).then(response => response.json()).then((data) => {
        word = data.body.Word;
        wordDescription = data.body.DefinitionMD;
        loadingMessage.style.display = 'none';
        setupGame();
    });
}

init();
