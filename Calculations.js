let playerName = prompt('Please enter your name.');
let tehtearv = prompt('Please enter how many calculations u would like to do! (NUMBER)');

if(tehtearv == null){
    tehtearv = 2;
}

class Calculation{
    constructor(name){
        this.name = name;

        this.calculationsInGame = 5;
        this.typeAnswers = [];
        this.typeCalculations = [];
        this.calculationsTyped = 0;
        this.correctAnswer = 0;


        this.startTime = 0;
        this.endTime = 0;
        this.results = [];

        this.loadFromFile();
    }

    loadFromFile(){
        $.get('database.txt', (data) => {
            let content = JSON.parse(data).content;
            console.log(data);
            localStorage.setItem('score', JSON.stringify(content));
            console.log(localStorage.getItem('score'));
            this.init();
        }).done();
        
    }

    init(){
        this.startCalculations();
        $('#show-results').on('click', ()=>{this.showResults();});
        if(localStorage.getItem('score')){
            this.results = JSON.parse(localStorage.getItem('score'));
        } else{
            console.log('Else Empty')
        }
    }

    startCalculations(){
        this.generateCalculations();
        this.startTime = performance.now();
        $(document).on('keypress', (event)=>this.checkAnswer(event.key));
    }

    checkAnswer(keypressed){
        if(this.calculationAnswer == keypressed && this.calculationsTyped != tehtearv - 1){
            console.log(keypressed);
            this.calculationsTyped++;
            this.selectCalculation();
        } else if(this.calculationAnswer == keypressed && this.calculationsTyped == tehtearv - 1){
            console.log('Last Calculation');
            this.endTime = performance.now();
            $('#score').html(this.name + " your time was " + ((this.endTime-this.startTime)/1000).toFixed(2));
            this.saveResult();
            this.calculationsTyped++;
            this.showInfo();
            $('#calcDiv').html("To start new game, press enter");
            $(document).off('keypress');
            $(document).on('keypress', (event)=>this.startGameWithEnter(event.keyCode));
        }
    }

    startGameWithEnter(keyPressed){
        console.log(keyPressed);
        if(keyPressed === 13){
            location.reload();
        }
    }

    saveResult(){
        let result = {
            name: this.name,
            time: ((this.endTime-this.startTime)/1000).toFixed(2),
            many: tehtearv
        }

        this.results.push(result);
        this.results.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
        localStorage.setItem('score', JSON.stringify(this.results));

        $.post('server.php', {save: this.results}).done(function(){
            console.log('Success');
        }).fail(function(){
            alert('FAIL');
        }
        ).always(function(){
            console.log("Tegime midagi AJAXiga");
        });
    }


    generateCalculations(){
        for(let i = 0; i < tehtearv; i++){
            const answer = Math.floor(Math.random() * 10);
            const number1 = Math.floor(Math.random() * 10);
            const number2 = Math.floor(Math.random() * 10);
            const number3 = number1 + number2 - answer;
            const string = `${number1}  + ${number2} - ${number3}`;


            this.typeAnswers[i] = answer;
            this.typeCalculations[i] = string;
            
        }

        console.log(this.typeAnswers);
        console.log(this.typeCalculations);

        this.selectCalculation();
    }

    selectCalculation(){
        this.calculation = this.typeCalculations[this.calculationsTyped];
        this.calculationAnswer = this.typeAnswers[this.calculationsTyped];

        this.drawCalculation();
    }


    drawCalculation(){
        $('#calcDiv').html(this.calculation);
        this.showInfo();
    }


    showResults(){
        $('#results').fadeToggle();
        console.log('Bring out the score');
        $('#results').html("");
        for(let i = 0; i < this.results.length; i++){            
            if(i === 20){break;}
            $('#results').append((i+1) + ". " + this.results[i].name + " " + this.results[i].time + " sec " + " & Calculations: " + this.results[i].many + "<br>");

        }
    }

    showInfo(){
        $('#info').html(this.calculationsTyped + "/" + tehtearv);
    }
}

let typer = new Calculation(playerName);