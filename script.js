$(function() {
	//run this script if body tag is 'indexPage'
	if ($('body').is('.indexPage')) {
		//initialize timeLeft variable with a number of 50
		var timeLeft = 50;
		// create questions array
		var questions = [
			//each element in this array is a question object built with the question constructor
			//follows form  (question, choices, answer)
			new Question("What is considered the official 'birth-year of the internet'?", ["1965", "1983", "1990", "1985"], "1983"),
			new Question("What year was W3Schools created?", ["1996", "1998", "2000", "2012"], "1998"),
			new Question("What does FOSS stand for?", ["Free-Open-Source-Software", "Forgiving-Operator-Syntax-Syndrome", "Flying-Over-South-Seoul", "Free-Open-Streaming-Software"], "Free-Open-Source-Software"),
			new Question("How can you add new properties to object constructors in JavaScript?", ["Prototype property", "Set method", "Object.add", "Object.set"], "Prototype property"),
			new Question("What does URL stand for?", ["Universal Readable Language", "Uniform Resource Locator", "Utility Realtime Loader", "Uniform Reference Letter"], "Uniform Resource Locator"),
			new Question("What is my favorite color?", ["Green", "Yellow", "Purple", "Black"], "Green")
		];
		//function that runs when the page is initialized 
		function init() {
			//reset local storage 'score' value to zero when quiz started
			localStorage.setItem("score", 0);
			//local storage alert variable that will allow prompt status to be stored in memory
			localStorage.setItem('alerted', 'no');
		};
		//timer functionality
		quizTimer = setInterval(function() {
			//if the timer is less than or equal to zero run this 
			if (timeLeft <= 0) {
				document.getElementById("timer").innerHTML = "Quiz is over";
				//sets a variable alerted to what is within the 'alerted' key in local storage
				var alerted = localStorage.getItem('alerted') || '';
				//this code ensures that the alert ('time is up') won't happen more than once
				//if this code is not added, the alert will repeatedly happen 
				if (alerted != 'yes') {
					alert("time is up!");
					//added local storage alert to prevent prompt from repeating
					localStorage.setItem('alerted', 'yes');
				}
				showScores();
			} else { //this code runs every second that the timer value is greater than or equal to 1
				document.getElementById("timer").innerHTML = timeLeft + " seconds remaining!";
			}
			timeLeft -= 1;
		}, 1000);
		// create Quiz function that uses questions array as an object  
		function Quiz(questions) {
			//sets initial score to 0
			this.score = 0;
			//sets initial questions to qustions array 
			this.questions = questions;
			//sets the initial questionIndex to 0
			this.questionIndex = 0;
		}
		// create quiz variable and initializes a new instance of quiz populated with questions element
		var quiz = new Quiz(questions);
		//gets the question index to express quesiton number in array 
		Quiz.prototype.getQuestionIndex = function() {
			return this.questions[this.questionIndex];
		};
		//uses questionIndex() function to display the question index number in html
		function showProgress() {
			var currentQuestionNumber = quiz.questionIndex + 1;
			var element = document.getElementById("questionNum");
			element.innerHTML = "Question " + currentQuestionNumber + " of " + quiz.questions.length;
		}
		//guess function that gets the users selected choice and compares it to the answer and increments question index
		Quiz.prototype.guess = function(answer) {
			//if choice is correct, add one to score
			if (this.getQuestionIndex().isCorrectAnswer(answer)) {
				this.score++;
			} else(timeLeft -= 5); //if false, subtract 5 points
			this.questionIndex++;
		};
		//function that runs when final quesiton has been answered
		Quiz.prototype.isEnded = function() {
			return this.questionIndex === this.questions.length;
		};

        //created Question class with contents of (text, choice, answer)
		function Question(text, choices, answer) {
			this.text = text;
			this.choices = choices;
			this.answer = answer;
		}
		//assigns the user choice to the answer
		Question.prototype.isCorrectAnswer = function(choice) {
			return this.answer === choice;
		};

        //function that populates question and answer buttons as well as question index number
		function populate() {
			if (quiz.isEnded()) {
				showScores();
			} else {
				// show question
				var element = document.getElementById("question");
				element.innerHTML = quiz.getQuestionIndex().text;
				var scoreTally = document.getElementById("scoreNumber");
				scoreTally.innerHTML = "Score : " + quiz.score;
				// show options
				var choices = quiz.getQuestionIndex().choices;
				for (var i = 0; i < choices.length; i++) {
					var element = document.getElementById("choice" + i);
					element.innerHTML = choices[i];
					guess("btn" + i, choices[i]);
				}
				showProgress();
			}
		}

        //function that assigns button clicked value to the quiz method 'answer' item
		function guess(id, guess) {
			var button = document.getElementById(id);
			button.onclick = function() {
				quiz.guess(guess);
				populate();
			};
		}

        //function that edits html elements to display user score and assigns the value to the local storage key 'score', also sets timeLeft to 0 
		function showScores() {
			var gameOverHTML = "<h1>Result</h1>";
			gameOverHTML += "<h2 id='score'> Your score is: " + quiz.score + "</h2>";
			gameOverHTML += "<p><a href='highscores.html'>Highscores</a></p>";
			var element = document.getElementById("quiz");
			element.innerHTML = gameOverHTML;
			localStorage.setItem("score", quiz.score);
			var scoreTally = document.getElementById("scoreNumber");
			scoreTally.innerHTML = "Score : " + quiz.score;
			timeLeft = 0;
		}
	}
	// display quiz
	init();
	populate();
});
$(function() {
	//only loads this script code when page is highscores.html
	if ($('body').is('.scoreBoardPage')) {
		//high scores are stored in local storage when game is ended
		//score is assigned to variable and then local storage element 'score' is populated with quiz.score
		//when user inputs name, name and local storage score is added as <li> on page
		var scoreBoardElement = document.querySelector("#scoreBoardEl");
		var scoreInput = document.querySelector("#scoreText");
		var scoreForm = document.querySelector("#highScoresForm");
		var score = localStorage.getItem(score);
		var scores = [];
		init();

        //function that runs when highscores.html is loaded 
		function init() {
			//get stored scores from localStorage
			var storedScores = JSON.parse(localStorage.getItem("scores"));
			if (storedScores !== null) {
				scores = storedScores;
			}
			renderScores();
		}

        //appends the score to HTML element <li>
		function renderScores() {
			scoreBoardElement.innerHTML = "";
			for (var i = 0; i < scores.length; i++) {
				var score = scores[i];
				var li = document.createElement("li");
				li.textContent = score;
				scoreBoardElement.appendChild(li);
			}
		}
		//when score form is sumbitted 
		scoreForm.addEventListener("submit", function(event) {
			event.preventDefault();
			var scoreText = scoreInput.value.trim();
			if (scoreText === "") {
				return;
			}
			scores.push(localStorage.getItem('score') + " -- " + scoreText);
			scoreInput.value = "";
			storeScores();
			renderScores();
		});

        //stores the user's score and text input to the local storage value of the 'scores' key
		function storeScores() {
			localStorage.setItem("scores", JSON.stringify(scores));
		}
	}
});