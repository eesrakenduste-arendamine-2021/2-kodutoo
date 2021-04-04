let playerName = prompt('Enter your name:');
let sentencesInGame = prompt('How many sentences should be displayed (default 1)');


//Juhul kui kasutaja ei sisesta lausete arvu voi sisestab mitte arvulise vaartuse
if (isNaN(sentencesInGame) || sentencesInGame === "") {
    sentencesInGame = 1;
} else if (sentencesInGame > 2001) {
    sentencesInGame = 2001;
}

class TouchTyper {
    constructor(name, sentences) {
        this.name = name;
        this.sentencesInGame = sentences;
        this.words = [];
        this.typeWords = [];
        this.wordsTyped = 0;
        this.startTime = 0;
        this.endTime = 0;
        this.results = [];
        this.word;
        this.loadFromFile();
        this.wkeys = 0;
        this.typedChars = 0;
        this.accuracy = 100;
        this.wordsPM = 0;
        this.minTime = 0;
        this.lastKey = 0;
        this.lastKeyEnabled = false;
        this.startTyperWithEnter = true;
    }

    //Loeb sisse database file ja seab selle localstoragesse
    loadFromFile() {
        $.get("db.txt", (data) => {
            let content = JSON.parse(data).content;
            localStorage.setItem('score', JSON.stringify(content));
            this.init();
        }).done();
    }

    //Loeb sisse laused kaivitab getSentences funktsiooni ja toob ekraanile voimaluse top 10 skoore naha
    init() {
        $.get("./assets/sentences.txt", (data) => this.getSentences(data));
        $('#show-results').on('click', () => { this.showResults(); });
        if (localStorage.getItem('score')) {
            this.results = JSON.parse(localStorage.getItem('score'));
        }

    }

    //Kaivitab sonade gen funktsiooni, alustab aja lugemist, ja hakkab klikke kuulama
    startTyper() {
        this.generateWords();
        this.startTime = performance.now();
        $(document).on('keypress', (event) => this.shortenWord(event));
    }

    //Arvutab sonade sageduse minutis ja kuvab selle
    wordsPerMinute() {
        this.minTime = ((performance.now() - this.startTime) / 1000) / 60;
        this.wordsPM = ((this.typedChars / 5) / this.minTime).toFixed(0);
        $("#wpm").html("WPM: " + this.wordsPM);
    }

    //Juhul kui vajutati valet nuppu, muudetakse ekraanil kuvatud klaviatuuril see nupp punaseks
    wrongButton(keyPressed) {
        if (keyPressed.keyCode == 32) {
            $(".SPACE").css("background-color", "red");
        } else {
            keyPressed = keyPressed.key.toUpperCase();
            $("." + keyPressed).css("background-color", "red");
        }
    }

    //Juhul kui vajutati oiget nuppu, muudetakse ekraanil kuvatud klaviatuuril see nupp kollaseks
    correctButton(keyPressed) {
        if (keyPressed.keyCode == 32) {
            $(".SPACE").css("background-color", "#acac00");
        } else {
            keyPressed = keyPressed.key.toUpperCase();
            $("." + keyPressed).css("background-color", "#acac00");
        }
    }

    //Muudab eelmisel klikil ara varvitud klaviatuuri nupu tagasi algseisundisse
    clearLastKey(lastkey) {
        if (lastkey.keyCode == 32) {
            $(".SPACE").css("background-color", "transparent");
        } else {
            lastkey = lastkey.key.toUpperCase();
            $("." + lastkey).css("background-color", "transparent");
        }
    }

    //Kontrollib tahtede vajutust, eemaldab tahe kui oigesti vajutati, arvutab tapsust,
    //kutsub valja wpm funktsiooni, varmismis funktsioonid
    shortenWord(keypressed) {
        if (this.lastKeyEnabled) {
            this.clearLastKey(this.lastKey);
        }
        this.typedChars++;
        if (this.word.length > 1 && this.word.charAt(0) == keypressed.key) {
            this.correctButton(keypressed);
            this.word = this.word.slice(1);
            this.drawSentence();
        } else if (this.word.length == 1 && this.word.charAt(0) == keypressed.key &&
            this.wordsTyped != this.sentencesInGame - 1) {
            this.correctButton(keypressed);
            this.wordsTyped++;
            this.selectWord();
        } else if (this.word.length == 1 && this.word.charAt(0) == keypressed.key &&
            this.wordsTyped == this.sentencesInGame - 1) {
            this.correctButton(keypressed);
            this.endTime = performance.now();
            $('#score').html(this.name + ", your words per minute: " + this.wordsPM + ",<br>" + "your accuracy: " +
                this.accuracy + "%");
            this.saveResult();
            this.wordsTyped++;

            $("#wordDiv").html("Press ENTER to start a new game");
            $(document).off('keypress');
            $(document).on('keypress', (event) => this.restartGameWithEnter(event.keyCode));

        } else {
            this.wkeys++;
            this.wrongButton(keypressed);
        }
        this.accuracy = Math.round(100 - (100 * (this.wkeys / this.typedChars)));

        this.wordsPerMinute();
        $("#accuracy").html("Accuracy: " + this.accuracy + "%");

        //Jatab meelde viimase nupu
        this.lastKey = keypressed;
        //Peale esimest vajutust hakkab keyboardi varvi vahetuse funktsioon toole
        this.lastKeyEnabled = true;


    }

    //Genereerib kuvatavad laused
    generateWords() {
        for (let i = 0; i < this.sentencesInGame; i++) {
            const randomSentence = Math.floor((Math.random() * 2000) + 0);
            this.typeWords[i] = this.words[randomSentence];
        }
        this.selectWord();
    }

    //Teeb sisse loetud lausetest massiivi
    getSentences(data) {
        const dataFromFile = data.split('\n');
        for (let i = 0; i < dataFromFile.length; i++) {
            this.words.push(dataFromFile[i]);
        }
        this.startGame();
    }

    //Votab masiivist lause mida kuvada ekraanil
    selectWord() {
        this.word = this.typeWords[this.wordsTyped];
        this.drawSentence();
    }

    //Kuvab ekraani peal lauseid
    drawSentence() {
        $('#wordDiv').html(this.word);
    }

    //Kuulab enteri vajutust, et alustada manguga
    startGame() {
        $("#wordDiv").html("Press ENTER to start");
        $(document).off('keypress');
        $(document).on('keypress', (event) => {
            if (event.keyCode === 13 && this.startTyperWithEnter) {
                this.startTyper();
                //Ilma startTyperWithEnterita saaks vajutada kesket mangu enter ja tekiksid uued laused, mis teeb mangu katki
                this.startTyperWithEnter = false;
            }
        });
    }

    //Kutsutakse valju kui viimane sumbol on ara kirjutatud ja kasutaja vajutab uut nuppu
    restartGameWithEnter(keyPressed) {
        if (keyPressed === 13) {
            location.reload();
        }
    }

    //Salvestab localstorage ja database tulemused
    saveResult() {
        let result = {
            name: this.name,
            accuracy: this.accuracy,
            wpm: this.wordsPM
        }
        this.results.push(result);
        //Jatsin skoori arvestamise tapsuse peale, sest WPM kasutades suutis see vahepeal suvalisi skoore esimeseks kohaks tuua
        this.results.sort((a, b) => parseFloat(b.accuracy) - parseFloat(a.accuracy));
        localStorage.setItem('score', JSON.stringify(this.results));
        $.post('./server.php', { save: this.results }).done(function() {
            console.log('Score saved to database');
        }).fail(function() {
            alert('Saving failed!');
        });
    }

    //Kuvab top 10 skooriga tulemused
    showResults() {
        $('#results').fadeToggle();
        $('#results').html("");
        for (let i = 0; i < this.results.length; i++) {
            if (i === 10) { break; }
            $('#results').append((i + 1) + ". Name: " + this.results[i].name + ", WPM: " + this.results[i].wpm +
                ", Accuracy: " + this.results[i].accuracy + "%<br>");
        }
    }

}

let touchtyper = new TouchTyper(playerName, sentencesInGame);