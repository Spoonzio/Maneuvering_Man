// Masterlist fo words
let wordDict = {
    "jason": "boomer",
    "hello": "greeting"
}

// Masterlist fo words

// Picked word
let gameWord = [];
let wordDef = "";

// User's progression
let userGuess = [];

// Limbs
let health = 7;

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

let buttonList = [];

// Score 
let score = 0;
let db;


function initializeFirebase() {

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAiIjqL3c9I3PKT7iFR9poW9pYabAND_ss",
        authDomain: "hangman-41fa7.firebaseapp.com",
        databaseURL: "https://hangman-41fa7.firebaseio.com",
        projectId: "hangman-41fa7",
        storageBucket: "hangman-41fa7.appspot.com",
        messagingSenderId: "278759498076",
        appId: "1:278759498076:web:3002181edab4e4b9f4a199"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();

}

initializeFirebase();
//
// Inititator: Populate game word as array with random word
//
function init() {
    userGuess = [];
    gameWord = [];
    wordDef = "";
    createNButtons();
    getLeaderboard();
    updateHealth();
    getRandomWord()
    censorWord();
    showDef();
}

function getRandomWord() { 

    if(Object.keys(wordDict).length > 0){
        let randIndex = parseInt(Math.random() * Object.keys(wordDict).length);
        gameWord = Object.keys(wordDict)[randIndex].split("");
        wordDef = wordDict[gameWord.join("")];
        delete wordDict[gameWord.join("")];
    }else{
        //get
        console.log(wordDict)
    }
}

//
// Swap letter with "_" to show word length
//
function censorWord() {
    for (let i = 0; i < gameWord.length; i++) {
        userGuess.push("_");
    }
    showWord();
}

//
// Get input from user
//

//
// Find letter by comparing each letter of game-word and guess letter. 
// Correct: Update word with letter
// Incorrect: Minus health
//
function updateUserWord(letter) {
    let correct = false

    for (let l = 0; l < gameWord.length; l++) {
        if (letter.toLocaleLowerCase() == gameWord[l].toLocaleLowerCase()) {
            userGuess[l] = letter;
            correct = true;
            buttonList[alphabet.indexOf(letter)].correct(letter);
        }
    }

    if (correct == false) {
        buttonList[alphabet.indexOf(letter)].wrong(letter);
        health--;
        console.log("health: " + health);

        if(health == 0){
            alert("You lose")
            endGame();
        }
    }

    // COMPARE BOTH ARRAYS TO SEE IF USER GUESS THE WORD CORRECTLY
    // IF TRUE, POST SCORE TO SCOREBOARD ON FIREBASE
    if (gameWord.toString() == userGuess.toString()) {
        score++;
        init()
        //updateScoreDisplay();
    }
    showWord();
    updateHealth();
}

function endGame(){
    //save score
    saveScore();
    
    // display leaderboard and ending message
    document.getElementById("leaderboard").style.display = "block";
  
}

function updateScoreDisplay() {
    document.getElementById("score").innerHTML = "Score: " + score;
}

//
// Present array as word
//
function showWord() {
    document.getElementById("guessBox").innerHTML = "<p class = 'guessWord'>" +userGuess.join(" ") + "</p>";
}

function showDef(){
    document.getElementById("definition").innerHTML = "<p class = 'guessDefinition'>" + wordDef + "</p>";
}

function updateHealth(){
    document.getElementById("health").innerHTML = "<p class = 'healthLevel'> health:" + health + "</p>";

}


function Button(i) {

    this.btn = document.createElement('button');
    this.btn.textContent = alphabet[i];
    this.btn.id = "button_" + alphabet[i];
    this.btn.onclick = function () {
        updateUserWord(alphabet[i])
    };

    this.display = function () {
        document.getElementById("letters").appendChild(this.btn);
    }

    this.wrong = function (letterGuessed) {
        let butt = buttonList[alphabet.indexOf(letterGuessed)];
        console.log(butt);
        butt.btn.disabled = true;
        butt.btn.style.backgroundColor = "red";
    }

    this.correct = function (letterGuessed) {
        let butt = buttonList[alphabet.indexOf(letterGuessed)];
        console.log(butt);
        butt.btn.disabled = true;
        butt.btn.style.backgroundColor = "green";
    }

}

function createNButtons() {

    if(buttonList.length == 26){
        let parentElem = document.getElementById("letters");
        let elems = parentElem.getElementsByTagName("button");
        let elemCount = elems.length;

        for(let k = 0; k<elemCount; k++){
            parentElem.removeChild(elems[0])
        }
        buttonList =[];
    }

    for (let i = 0; i < 26; i++) {
        buttonList.push(new Button(i));
        buttonList[i].display();
    }
};


// ADD HIGHSCORE TO FIREBASE 
function saveScore() {
    
    let nameTextField = document.getElementById("name");
    console.log(nameTextField);
    // ONLY UPDATE HIGH SCORE IF THERE IS A NAME
    if (nameTextField.value.length > 0) {
        
        // Add a new document with a generated id.
        db.collection("scores").add({
                name: nameTextField.value,
                score: score
            })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
            });
    }

}

function getLeaderboard() {
    let leaderboardName = document.getElementById("leaderboardName");
    let leaderboardScore = document.getElementById("leaderboardScore");

    db.collection("scores").orderBy('score', 'desc').limit(3).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let a = document.createElement("div");
                a.class = "table-cell"
                a.innerHTML = doc.data().name;


                let b = document.createElement("div");
                b.class = "table-cell"
                b.innerHTML = doc.data().score;

                leaderboardName.append(a);
                leaderboardScore.append(b);



            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    });





}

init()

