let playerName = prompt("Please enter your name");
let turns = "";
let entered = "";
let tries = 0;

class Calc {
    constructor(name) {
        while (name == "") {
            name = prompt("Please enter your name");
        }
        this.name = name;
        this.equations = [];
        this.answers = [];
        this.turnsTaken = 0;
        this.startTime = 0;
        this.endTime = 0;
        this.results = [];
        this.equation;
        this.equationAnswer;
        this.answer;
        this.tries = [];
        while (turns == "" || !$.isNumeric(turns) || Math.floor(turns) != turns || turns <= 0) {
            if (turns == "") {
                turns = prompt("How many equations would you like to solve?");
            } else {
                turns = prompt("Please enter a positive integer. How many equations would you like to solve?");
            }            
        }
        this.turns = turns;
        this.loadFromFile();
    }

    loadFromFile() {
        $.get('db.txt', (data) => {
            if (data) {
                let content = JSON.parse(data).content;
                localStorage.setItem('score', JSON.stringify(content));
            }
            this.init();
        }).done();
    }

    init() {
        this.startCalc();
        $('#show-results').on('click', () => this.showResults());
        if (localStorage.getItem('score')) {
            this.results = JSON.parse(localStorage.getItem('score'));
        }
    }

    startCalc() {
        this.generateEquation();
        this.startTime = performance.now();
        $(document).on('keypress', (e) => this.checkAnswer(e.key));
    }

    generateEquation() { // Getting a random operator: https://stackoverflow.com/questions/21227041/how-to-get-random-math-operator-for-a-quiz-qustion-in-javascript
        const operators = [{
            sign: "+",
            method: function(a, b) { return a + b; }
        }, {
            sign: "-",
            method: function(a, b) { return a - b; }
        }, {
            sign: "*",
            method: function(a, b) { return a * b; }
        }, {
                sign: "/",
            method: function(a, b) { return a / b; }
        }];
        for (let i = 0; i < this.turns; i++) {
            const randomCalculation = Math.floor(Math.random() * 2); // operators.length); <-- use if you want to include multiplication and division
            const randomFirst = Math.round(Math.random() * 101);
            const randomSecond = Math.round(Math.random() * 100) + 1;
            this.equations[i] = randomFirst +" " + operators[randomCalculation].sign + " " + randomSecond;
            this.answers[i] = operators[randomCalculation].method(randomFirst, randomSecond);
            console.log(this.equations[i] + ": " + this.answers[i]);
        }
        this.selectEquation();
        
    }

    selectEquation() {
        this.equation = this.equations[this.turnsTaken];
        this.equationAnswer = this.answers[this.turnsTaken];
        this.drawEquation();
    }

    drawEquation() {
        $('#calculationDiv').html(this.equation);
        this.showTurns();
    }

    showTurns() {
        $('#turns').html(this.turnsTaken + "/" + this.turns);
    }

    checkAnswer(key) {
        if (key === "Enter" && this.turnsTaken < this.turns) {
            this.answer = Number(entered.replace("," , ".")); // <-- Replace is in case division is used
            if (this.answer == this.equationAnswer) {
                $('#feedback').html("Correct!");
                tries++;
                this.tries.push(tries);
                tries = 0;
                this.turnsTaken++;
                if (this.turnsTaken == this.turns) {
                    this.endTime = performance.now();
                    let average = 0;
                    this.tries.forEach(attempt => {
                        average += attempt;
                    });
                    average = (average / this.tries.length).toFixed(2);
                    $('#score').html(this.name + "<br>Average turns per round: " + average + " <br>Average time per round: " + (((this.endTime - this.startTime) / 1000) / this.turns).toFixed(2) + " seconds");
                    this.saveResult(average);
                    this.showTurns();
                    $('#calculationDiv').html("<br>");
                    $('#feedback').html("Well done!<br>To start a new game, press Enter.");
                    $(document).off('keypress');
                    $(document).on('keypress', (e) => this.startGameWithEnter(e.keyCode));                    
                } else {
                    this.selectEquation();
                }
            } else {
                $('#feedback').html("Incorrect! Try again!");
                tries++;
                this.selectEquation();
            }
            entered = "";
        } else {
            $('#feedback').html("");
            entered = entered + key.toString();
        }
    }

    saveResult(average) {
        let result = {
            name: this.name,
            average: average,
            time: (((this.endTime - this.startTime) / 1000) / this.turns).toFixed(2)
        }

        this.results.push(result);
        this.results.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
        this.results.sort((a, b) => parseFloat(a.average) - parseFloat(b.average));
        localStorage.setItem('score', JSON.stringify(this.results));

        $.post('server.php', {save: this.results});
    }

    startGameWithEnter(keyPressed) {
        if (keyPressed === 13) {
            location.reload();
        }
    }

    showResults() {
        $('#results').fadeToggle().css('display', 'flex');
        $('#turns').fadeToggle();
        $('#show-results').fadeOut(200, function() { // With help from: https://stackoverflow.com/questions/1490563/why-doesnt-jquery-fadein-work-with-html
            if ($('#show-results').html() == "TOP 10") {
                $('#show-results').html("X");
            } else {
                $('#show-results').html("TOP 10");
            }
        }).fadeIn(200);
        
        $('#results').html("");
        let datastring = "<h1>TOP 10</h1><table class=\"results-table\"><thead><tr><th></th><th>Name</th><th>Average<br>tries per equation / time per turn</th></tr></thead><tbody>";
        for (let i = 0; i < this.results.length; i++) {
            if (i === 10) {
                break;
            }
            datastring += "<tr><td>" + (i + 1) + ".</td><td>" + this.results[i].name + "</td><td>" + this.results[i].average + " / " + this.results[i].time + "</td></tr>";
        }
        datastring += "</tbody></table>";
        $('#results').html(datastring);
    }
}

let calc = new Calc(playerName);