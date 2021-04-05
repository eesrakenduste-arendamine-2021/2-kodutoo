let playerName = prompt("Palun sisesta oma nimi");
var activeChar = "";

class Hangman{
    constructor(playerName){
        if(playerName == ""){
            this.playerName = "Undefined";
        } else {
            this.playerName = playerName;
        }
        
        this.fileName = "sagedadsonad.txt";
        this.wordsFromFile = [];
        this.selectedWord;
        this.hiddenWord = "";
        this.activeChar;
        this.chars = [];
        this.wrongChars = [];
        this.results = [];
        this.score = 0;
        this.lives = 7;
        this.currentPicture = 1;
        this.end = 0;
        this.loadFromFile();
    }

    loadFromFile(){
        $.get("database.txt", (data) => {
            let content = JSON.parse(data).content;
            localStorage.setItem("score", JSON.stringify(content));
            this.init(this.fileName);
        }).done();
    }

    init(fileName){
        $("#show-results").on("click", ()=>{this.showResults();});
        if(localStorage.getItem("score")){
            this.results = JSON.parse(localStorage.getItem("score"));
        } else{
            console.log("Empty")
        }
        $.get(fileName, (data)=>this.getWords(data));
        this.startHangman();
    }
    
    selectRandomWord(){
        this.selectedWord = this.wordsFromFile[Math.floor(Math.random() * 768)];
        this.splitString();
    }


    getWords(data){
        this.wordsFromFile = data.split("\n");
        for(var i = 0; i < this.wordsFromFile.length; ++i){
            this.wordsFromFile[i] = this.wordsFromFile[i].replace(/(\r)/gm,"")
        }
        this.selectRandomWord();
    }

    splitString(){
        for (var i = 0; i < this.selectedWord.length; i++) {
            this.chars[i] = this.selectedWord.charAt(i);
        }
        this.hideWord()
    }

    hideWord(){
        for(var i = 0; i < this.chars.length; i++){
            this.hiddenWord += "_";
        }
        this.drawWord(this.hiddenWord);
    }

    drawWord(word){
        if(word.includes("_")){
            $("#screenWord").html(word);
        } else {
            this.newWord();
        }
        
    }

    startHangman(){
        $("#buttonContainer button").on("click", (event)=>this.readButtonClick(event.currentTarget.id));
    }

    
    readButtonClick(buttonPressed){
        this.activeChar = buttonPressed.toLowerCase();
        this.replaceCharInString();
    }

    replaceCharInString(){
        for(var i=0;i < this.chars.length; i++){
            if(this.chars.includes(this.activeChar)){
                if(this.chars[i] == this.activeChar){
                    this.hiddenWord = this.hiddenWord.substring(0, i) + this.activeChar + this.hiddenWord.substring(i + 1);
                    this.drawWord(this.hiddenWord);
                }
            } else if(this.wrongChars.includes(this.activeChar)){
                continue;
            }
        }
        if(this.wrongChars.includes(this.activeChar)){

        } else if (this.chars.includes(this.activeChar) == false){
            this.wrongChars.push(this.activeChar);
            this.drawWrongChar();
            this.drawStickman();
        }
        
    }

    drawWrongChar(){
        if(this.wrongChars.length == 5 || this.wrongChars.length == 11 || this.wrongChars.length == 17){
            this.wrongChars.push("<br>");
            $("#usedLetters").html(this.wrongChars);
        } else {
            $("#usedLetters").html(this.wrongChars);
        }
        
    }

    drawStickman(){
        if(this.lives > 2 && this.lives < 8){
            this.lives -= 1;
            this.currentPicture = this.lives;
            var newPicture = "img/hangman" + this.currentPicture + ".png";
            $("img").attr("src", newPicture);
        } else if (this.lives == 8){
            this.lives = 7;
            $("img").attr("src", "img/hangman7.png");
        } else{
            $("img").attr("src", "img/hangman1.png");
            this.gameEnd();
        }
        
        
    }

    gameEnd(){
        $("#end").css("display", "flex").fadeIn();
        this.saveResult();
        $("#lastWord").text("Viimane sõna oli: " + this.selectedWord);
        $("#scoreEnd").text("Skoor: " + this.score);
        $("#newGame").css("display", "flex").fadeIn();
        $("#flexContainer").fadeOut();
        $("#newGame").on("click", ()=>location.reload());
    }

    newWord(){
        this.score = this.score + 1;
        $("#score").text("Skoor: " + this.score);
        this.hiddenWord = "";
        this.selectedWord = "";
        this.activeChar = "";
        this.chars = [];
        this.wrongChars = [];
        this.lives = 8;
        this.selectRandomWord();
    }

    saveResult(){
        let result = {
            name: this.playerName,
            score: this.score
        }

        this.results.push(result);
        this.results.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        localStorage.setItem("score", JSON.stringify(this.results));

        $.post("server.php", {save: this.results}).done(function(){

        }).fail(function(){
            alert("Saving to database failed");
        });
    }

    showResults(){
        if($("#end").css("display") == "flex" || this.end == 1){
            this.showResultsEnd();
        } else {
            $("#results").fadeToggle().css("display", "flex");
            $("#flexContainer").fadeToggle().css("display", "flex");
            $("#results").html("");
            for(var i = 0; i < this.results.length; i++){
                if(i == 10){
                    break;
                }
                $("#results").append((i+1) + ". " + this.results[i].name + " " + this.results[i].score + "<br>");
            }
        }
    }

    showResultsEnd(){
        $("#results").fadeToggle().css("display", "flex");
        $("#end").fadeToggle().css("display", "flex");
        $("#results").html("");
        this.end = 1;
        for(var i = 0; i < this.results.length; i++){
            if(i == 10){
                break;
            }
            $("#results").append((i+1) + ". " + this.results[i].name + " " + this.results[i].score + "<br>");

        }
    }
}

let hangman = new Hangman(playerName);