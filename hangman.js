let word; 
let wordDescription;
let wordArray;
let guessedLetters = [];
let wrongGuessedLetters = [];
let guessOpportunities = 6;
let lettersLeftToGuess = [];
let wordDescriptionHtml = document.getElementById('description');
let letterGuess = document.getElementById('letter');
let wordDisplay = document.getElementById('displayedWord');

wordDescriptionHtml.style.display = 'none';


let setupRandomWord = async () => {
    await fetch('https://spanish-random-words.p.rapidapi.com/random',{
        headers: {
            'x-rapidapi-key': '313804c0b6mshe3be3db0ce29dcap1f2df8jsnf3b7b339dba4',
            'x-rapidapi-host': 'spanish-random-words.p.rapidapi.com'
          }
    }).then(response => response.json()).then(data => data);
}


let setupGame = () => {   
    if(word != undefined) {

        wordArray = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split('');
        console.log(wordArray);
        lettersLeftToGuess = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").split('');

        wordArray.forEach((item) => {
            let element = document.createElement('span');

            if(item == ' ') {
                element.className = 'space' 
            } else {
                element.className = 'underline'
            }

            console.log(item);
            
            wordDisplay.appendChild(element);
        });

        letterGuess.addEventListener('input', checkLetter);
        updateChances();
    }
}

let checkLetter = (e) => {
    let selectedLetter = e.target.value;
    let isRepeatedGuess = guessedLetters.includes(selectedLetter);
    let letterIsInWord = wordArray.includes(selectedLetter);


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
                   console.log('GANASTE CAPOO');
                   letterGuess = document.getElementById('letter').disabled = true;

                   let underlines = document.getElementsByClassName('underline');
                   for(let i = 0; i < underlines.length; i++) {
                        console.log(underlines[i])
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



                console.log();

                updateChances();
                console.log(wrongGuessedLetters);
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
                console.log('you already selected that one and it was incorrect')
                console.log(wrongGuessedLetters);
            }
        }

    } else {
        console.log('ya elegiste esa');
    }

    e.target.value = '';
}

let gameOver = () => {
    console.log('game over ma dude')
    letterGuess = document.getElementById('letter').disabled = true;
    showDescription();
}

let showDescription = () => {
    document.getElementById('description').innerHTML = wordDescription;
    if(wordDescription != '') {
        wordDescriptionHtml.style.display = 'block';
    }
}


let updateChances = () => {
    document.getElementById('chancesLeft').textContent = guessOpportunities;
} 

fetch('https://spanish-random-words.p.rapidapi.com/random',{
    headers: {
        'x-rapidapi-key': '313804c0b6mshe3be3db0ce29dcap1f2df8jsnf3b7b339dba4',
        'x-rapidapi-host': 'spanish-random-words.p.rapidapi.com'
      }
}).then(response => response.json()).then((data) => {
    word = data.body.Word;
    console.log(data.body)
    wordDescription = data.body.DefinitionMD;
    setupGame();
});