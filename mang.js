var myNumber = 0,
	nOfGuesses = 0;

function writeMessage(elementId, message, appendMessage) {
	var elemToUpdate = document.getElementById(elementId);
	if (appendMessage) {
		elemToUpdate.innerHTML = elemToUpdate.innerHTML + message;
	} else {
		elemToUpdate.innerHTML = message;
	}
};

function newGame() {
	myNumber = Math.floor(Math.random() * 100) + 1;
	nOfGuesses = 0;
	writeMessage('historyL', '');
}

function guessInRange(guess) {
	return (guess > 0 && guess < 101);
}

function userGuessed() {
	var userGuessed = document.getElementById('uGuess').value;
	var status = document.getElementById('status');
	var historyL = document.getElementById('historyL');
	if (userGuessed.length == 0 || ! guessInRange(userGuessed)) {
		// Sisestatud arv ei ole vahemikus
		writeMessage('status', '<p>Sisesta arv vahemikus 1-100!</p>');
	} else if (userGuessed.indexOf('.') != -1) {
		writeMessage('status', '<p>Palun sisesta täisarv vahemikus 1-100!</p>');
	} else {
		nOfGuesses++;

		if (userGuessed == myNumber) {
			// Pihtas
			writeMessage('status', '<p>Arvasid ära ' + nOfGuesses +' korraga. Arv oli ' + myNumber + '. <br> Võid alustada uuesti arvamist! </p>');
			newGame();
		} else if (userGuessed < myNumber) {
			// vastus oli liiga väike
			writeMessage('status', '<p>Arv on suurem, kui ' + userGuessed + '. Arva veel!</p>');
			writeMessage('historyL', '<li>' + userGuessed +' (õige arv on suurem)</li>', true);
		} else {
			// vasus oli liiga suur
			writeMessage('status', '<p>Arv on väiksem, kui ' + userGuessed + '. Arva uuesti!</p>');
			writeMessage('historyL', '<li>' + userGuessed + ' (õige arv on väiksem)</li>', true);
		}
	}

	document.getElementById('uGuess').value = '';	
}

window.onload = function() {
	newGame();
	document.getElementById('button').addEventListener('click', userGuessed);
};

