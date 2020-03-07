// Masterlist fo words
const wordList = ["JasonIsABoomer", "Hello"]

// Picked word
let gameWord = [];

// User's progression
let userGuess = [];

// Limbs
let health = 6;

//
// Inititator: Populate game word as array with random word
//
function init(){
    let randIndex = parseInt(Math.random()*wordList.length);
    gameWord = wordList[randIndex].split("");
}

//
// Swap letter with "_" to show word length
//
function censorWord(){
    for(let i = 0; i<gameWord.length; i++){
        userGuess.push("_");
    }

    showWord();
}

//
// Get input from user
//
function userInput(){
    letterGuessed = document.getElementById("letterGuess").value;
    updateUserWord(letterGuessed);
}

//
// Find letter by comparing each letter of game-word and guess letter. 
// Correct: Update word with letter
// Incorrect: Minus health
//
function updateUserWord(letter){
    let correct = false

    if(userGuess.includes(letter)){
        console.log("Already guessed")
    }

    for(let l = 0; l <gameWord.length; l++){
        if(letter == gameWord[l]){
            userGuess[l] = letter;
            correct = true;
        }
    }

    if (correct == false){
        health--;
        console.log("health: " + health)
    }

    showWord()
}

//
// Present array as word
//
function showWord(){
    console.log(userGuess.join(" "));
}

init()
censorWord();
