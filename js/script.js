// Masterlist fo words
let wordDict = {
    "marburg": "Identified in 1967, in Germany from exposure to infected monkeys. Symptoms: high fevers, bleeding, shock, and organ failure",
    "ebola": "First identified in the Republic of Sudan and the Democratic Republic of Congo in 1976. Mainly spread through contact with bodily fluids or infected tissue. Symptoms: fever, fatigue, abdominal pain, Unexplained hemorrhaging, bleeding or bruising",
    "rabies": "Although a vaccine for this virus was introduced in the 1920s, this virus remains a serious problem in India and parts of Africa. Symptoms: irritability or aggressiveness, confusion or hallucinations, muscle spasms, seizures, extreme sensitivity",
    "hiv": "Often names the most deadly virus of the modern world this virus was first recognized in the early 1980s and is transmitted through bodily fluids. This virus interfere's with the body's ability to fight infection and disease Symptoms: sweats, recurring fever, diarrhea, pneumonia, significant weight loss",
    "smallpox": "in 1980 the world was declared free of this virus, but during it's existance it killed about 1 in 3 of those infected, leaving survivors with deep, permanent scars and often blindness. Symptoms: high fever, skin rash and scabs, headaches, vomiting, diarrhea, sores",
    "hantavirus": "A repitory disease that can be fatal, this disease originated in South Korea from a small rodent. Symptoms: dizziness, fever and chlls, stomach pain, nausea, and coughing",
    "influenza": "A viral infection that attacks the respitory system. This virus is the reason for seasonal flu epidemics each year. Symptoms: fever, cough, sore throat, muscle or body aches, headaches, fatigue.",
    "sars": "A viral respitory illness caused by a corona virus, recognized as a global threat in 2003, after first appearing in Southern China in 2002. Symptoms: high fever, body aches, headaches, and mild respiratory symptoms",
    "corona": "Discovered in 2019, this is the most recently discovered strain. Symptoms: cough, fever, tiredness, difficulty breathing",
    "mers": "This virus is spread from an infected person's respiratory secretions, althought the origins are not fully understood it believed to have been originated from the middle east Symptoms: fever, cough, shortness of breath, diarrhea, nausea and vomiting",
    //for testing
    "tattoo": "a form of body modification where a design is made by inserting ink",
    "electricity": "is the set of physical phenomena associated with the presence and motion of electric charge.",
    "committee": "a group of people appointed for a specific function, typically consisting of members of a larger group."
}

// Picked word and its definition
let gameWord = [];
let wordDef = "";

// User's progression
let userGuess = [];

// Limbs
let health = 7;
const MAX_HEALTH = 7;

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const ALPHABET_COUNT = 26;
let buttonList = [];

// Score 
let score = 0;
let db;
let nickname;

//
// API for firebase
//
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
// Initiator: Populate game word as array with random word
//

function init() {
    userGuess = [];
    gameWord = [];
    wordDef = "";

    getRandomWord()
    createNButtons();
    getLeaderboard();
    updateHealth();
    updateScoreDisplay();

    censorWord();
    showDef();
    setStickman()
    loadNickName();
}

//
// From the Master list, select a word, format, and delete from list. End game when list is empty
//
function getRandomWord() {

    if (Object.keys(wordDict).length > 0) {
        let randIndex = parseInt(Math.random() * Object.keys(wordDict).length);
        gameWord = Object.keys(wordDict)[randIndex].split("");
        wordDef = wordDict[gameWord.join("")];
        delete wordDict[gameWord.join("")];
    } else {
        endGame();
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
// Find letter by comparing each letter of game-word and guess letter. 
// Correct: Update word with letter
// Incorrect: Minus health
//
function updateUserWord(letter) {
    let correct = false;

    for (let l = 0; l < gameWord.length; l++) {
        if (letter.toLocaleLowerCase() == gameWord[l].toLocaleLowerCase()) {
            score++;
            userGuess[l] = letter;
            correct = true;
            buttonList[alphabet.indexOf(letter)].correct(letter);
        }
    }

    // Check health
    if (correct == false) {
        buttonList[alphabet.indexOf(letter)].wrong(letter);
        health--;
        score--;
        console.log("Health: " + health);

        if (health == 0) {
            alert("You lose")
            endGame();
        }
        moveStickman(health);
    }

    // COMPARE BOTH ARRAYS TO SEE IF USER GUESS THE WORD CORRECTLY
    // IF TRUE, POST SCORE TO SCOREBOARD ON FIREBASE
    if (gameWord.toString() == userGuess.toString()) {
        init();
        //updateScoreDisplay();
    }
    showWord();
    updateHealth();
    updateScoreDisplay();

}

function setStickman() {
    let man = document.getElementById("maneuveringMan");
    man.setAttribute("src", "src/images/runningMan.gif");
    console.log(man);
    man.setAttribute("style", "max-width: 10%; position: relative; left: 0px");

    let div = document.getElementById("stickManView");
    div.appendChild(man);
}


function moveStickman(current_health) {
    let man = document.getElementById("maneuveringMan");
    let part = window.innerWidth / MAX_HEALTH;
    console.log(MAX_HEALTH);
    console.log(part);
    let right = Math.floor((MAX_HEALTH - current_health) * part);
    man.setAttribute("style", "max-width: 10%; position: relative; left: " + right + "px");
    console.log("it moved check! " + right);
}

//
// Remove buttons, show leaderboard
//
function endGame() {

    //Remove buttons when game is over (hide?)
    removeButtons();
    //save score
    saveScore();
    hideMainDiv();

    getLeaderboard();
    showLeaderBoard();
    // display leaderboard and ending message

}


function reset() {

    window.location.replace("index.html");

}


//
// Update user's score
//
function updateScoreDisplay() {
    document.getElementById("nav_score").innerText = "Score: " + score;

}

//
// Present array as word
//
function showWord() {
    if (gameWord.length > 0) {
        document.getElementById("guessBox").innerHTML = "<p id = 'guessWord'>" + userGuess.join(" ") + "</p>";
    } else {
        document.getElementById("guessBox").innerHTML = "<p id = 'guessWord'>SOOOOWWYYYYY NO MORE WORDS!</p>";

    }
}

//
// Show the game word's definition
//
function showDef() {
    document.getElementById("definition").innerHTML = "<p id = 'guessDefinition'>" + "Definition: " + wordDef + "</p>";
}

//
// Update user's health
//
function updateHealth() {
    document.getElementById("nav_health").innerText = "Health: " + health;

}


//
// Button's constructor
//
function Button(i) {

    // Button's attributes
    this.btn = document.createElement('button');
    this.btn.textContent = alphabet[i];
    this.btn.classList.add("guessButtonNormal");

    this.btn.id = "button_" + alphabet[i];
    this.btn.onclick = function() {
        updateUserWord(alphabet[i]);
    };

    // Show self
    this.display = function() {
        document.getElementById("letters").appendChild(this.btn);
    }

    // Show button is incorrect
    this.wrong = function(letterGuessed) {
        let butt = buttonList[alphabet.indexOf(letterGuessed)];
        console.log(butt);
        butt.btn.disabled = true;
        butt.btn.classList.replace("guessButtonNormal", "guessButtonWrong");
    }

    // Show button is correct
    this.correct = function(letterGuessed) {
        let butt = buttonList[alphabet.indexOf(letterGuessed)];
        console.log(butt);
        butt.btn.disabled = true;
        butt.btn.classList.replace("guessButtonNormal", "guessButtonRight");
    }
}

//
// Create on screen buttons for alphabet
//
function createNButtons() {
    if (buttonList.length == ALPHABET_COUNT) {
        removeButtons();
    }

    for (let i = 0; i < ALPHABET_COUNT; i++) {
        buttonList.push(new Button(i));
        buttonList[i].display();
    }
};

//
// Remove button objects from screen
//
function removeButtons() {
    let parentElem = document.getElementById("letters");
    let elems = parentElem.getElementsByTagName("button");
    let elemCount = elems.length;

    for (let k = 0; k < elemCount; k++) {
        parentElem.removeChild(elems[0]);
    }
    buttonList = [];
}


// ADD HIGHSCORE TO FIREBASE 
function saveScore() {

    // ONLY UPDATE HIGH SCORE IF THERE IS A NAME
    if (nickname.length > 0) {

        // Add a new document with a generated id.
        db.collection("scores").add({
                name: nickname,
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

function getLeaderboard() {

    document.getElementById("userScoreLeaderboard").innerText = "Your Score is: " + score;

    let leaderboardTBody = document.getElementById("leaderboardBody");
    leaderboardTBody.innerHTML = "";

    let i = 1;

    db.collection("scores").orderBy('score', 'desc').limit(3).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let row = document.createElement("tr");

                let head = document.createElement("th");
                head.scope = "row";
                head.innerText = i;
                i++;

                let nameData = document.createElement("td");
                nameData.innerHTML = doc.data().name;

                let scoreData = document.createElement("td");
                scoreData.innerHTML = doc.data().score;

                leaderboardTBody.append(row);
                leaderboardTBody.append(head);
                leaderboardTBody.append(nameData);
                leaderboardTBody.append(scoreData);



            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
    });
}

function loadNickName() {
    if (localStorage.getItem('nickName').length > 0) {
        document.getElementById("nicknameInput").value
    }


}

function saveNickName() {
    localStorage.setItem('nickName', document.getElementById("nicknameInput").value)
    nickname = document.getElementById("nicknameInput").value;
    console.log("Nickname is " + nickname);
    showMainDiv();


}


function hideNickNameInput() {

    document.getElementById("nicknameInputDiv").classList.replace("d-fluid", "d-none");

}

function showNickNameInput() {

    document.getElementById("nicknameInputDiv").classList.replace("d-none", "d-fluid");

}


function showMainDiv() {

    document.getElementById("mainDiv").classList.replace("d-none", "d-block");
    hideNickNameInput();
    hideLeaderBoard();

}

function hideMainDiv() {

    document.getElementById("mainDiv").classList.replace("d-block", "d-none");

}


function hideLeaderBoard() {

    document.getElementById("leaderboard").classList.replace("d-flex", "d-none");

}

function showLeaderBoard() {

    document.getElementById("leaderboard").classList.replace("d-none", "d-flex");


}
init()