// Masterlist fo words
const wordList = ["JasonIsABoomer", "Hello"]

// Picked word
let gameWord = [];

// User's progression
let userGuess = [];

// Limbs
let health = 6;

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// Score 

let score = 0;
let db;


function initializeFirebase(){

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

//
// Inititator: Populate game word as array with random word
//
function init(){
    initializeFirebase();
    createNButtons(26);
    getLeaderboard();
    

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
function userInput(button){
    letterGuessed = button["target"].textContent;
    document.getElementById("button_" + letterGuessed).onclick = null;

    updateUserWord(letterGuessed);
}

//
// Find letter by comparing each letter of game-word and guess letter. 
// Correct: Update word with letter
// Incorrect: Minus health
//
function updateUserWord(letter){
    let correct = false

    for(let l = 0; l <gameWord.length; l++){
        if(letter.toLocaleLowerCase() == gameWord[l].toLocaleLowerCase()){
            userGuess[l] = letter;
            correct = true;
        }
    }

    if (correct == false){
        health--;
        console.log("health: " + health)
    }

// COMPARE BOTH ARRAYS TO SEE IF USER GUESS THE WORD CORRECTLY
// IF TRUE, POST SCORE TO SCOREBOARD ON FIREBASE

  if (gameWord.toString() == userGuess.toString()){
      console.log("Score ++");
      score++;
      saveScore();

  }


    showWord()
}

//
// Present array as word
//
function showWord(){
    console.log(userGuess.join(" "));
   
}


function createNButtons(num){

    for (let i = 0; i < num; i++){
    
        if (num <= 0 || num > 26){
            showInvalidError();
        }
    
        let button = document.createElement('button');
        button.textContent = alphabet[i];
        button.id = "button_" + alphabet[i];
        button.onclick = userInput;
    
    
        document.body.append(button);
    }
    };


// ADD HIGHSCORE TO FIREBASE 
function saveScore(){
    
 let nameTextField = document.getElementById("name");
// ONLY UPDATE HIGH SCORE IF THERE IS A NAME

 if (nameTextField.length > 0){

    // Add a new document with a generated id.
 db.collection("scores").add({
    name: nameTextField.value,
    score: score
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
}); 
 }

}

function getLeaderboard(){
    let leaderboard =  document.getElementById("leaderboard");

    db.collection("scores").orderBy('score', 'desc').limit(3).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let a = document.createElement("p");
                
                a.innerHTML = doc.data().name + "&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" + doc.data().score;
                
                leaderboard.append(a);

                
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    });
    
    
       
        

}

init()
censorWord();
