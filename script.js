var name = prompt("Enter you'r nickname.");


class Calc{
    constructor(name){
        this.name = name;

        this.level = 1;
        this.experience = 0;
        this.experienceNeeded = 10;

        this.results = [];

        this.readFromFile();
    }


    levelUp(){
        while(this.experience >= this.experienceNeeded){
            this.level++;
            this.experience -= this.experienceNeeded;
            // Abi materjal ja idee - https://www.w3schools.com/jsref/jsref_pow.asp
            this.experienceNeeded = 5 * Math.pow(this.level, 2) + 5 * this.level;

            this.showProgression();
        }
    }

    // Abi materjal ja idee - https://stackoverflow.com/questions/41333153/simple-level-system-with-xp-money-and-levels
    showProgression(){
        document.getElementById("level").innerHTML = "Level: " + this.level;
        document.getElementById("experience").innerHTML = "Experience: " + this.experience + " / " + this.experienceNeeded;
    }

    

    checkCalculations(){
        console.log("made it");

        var correct = 0;

        for(var i = 0; i < 10; i++){
            var textarea = document.getElementById(i);
            console.log(textarea.value);
            if(textarea.value == textarea.solution){
                correct++;
                this.experience++;
            }
        }

        var calculations = document.getElementById("calculations");
        calculations.innerHTML = "Out of 10 calculations " + correct + " were correct.";
        this.levelUp();
        this.showProgression();
        //this.readFromFile();
        if(localStorage.getItem('score')){
            this.results = JSON.parse(localStorage.getItem('score'));
        }
        this.saveResult(level);
        
        
    }


    saveResult(level) {
        let result = {
            name: this.name,
            level: this.level
        }

        this.results.push(result);
        console.log(results);
        
        //this.results.sort((a, b) => parseFloat(a.level) - parseFloat(b.level));
        this.results.sort(this.compare);
        localStorage.setItem('database.txt', JSON.stringify(results));

        console.log(this.results);

        $.post('server.php', {save: this.results}).done(function(){
            console.log('Push successful');
        }).fail(function(){
            alert('Could not push');
        }
        ).always(function(){
            console.log("Pushing");
        });

    }

    showScoreBoard(){
        console.log(this.results);
        $('#results').html("");
        this.results.sort(this.compare);
        console.log(this.results)

        for(let i = 0; i < this.results.length; i++){
            if(i === 10){break;}
            $('#results').append((i+1) + ". " + this.results[i].name + " " + this.results[i].level + "; ")
        }
    }

    compare( a, b){
        if(a.level < b.level){
            return 1;
        }
        else if(a.level > b.level){
            return -1;
        }
        return 0;
    }

    readFromFile(){
        $.get('database.txt', (data) =>{
            console.log("Reading from file");
            let content = JSON.parse(data).content;
            localStorage.setItem('fromFile', JSON.stringify(content));
                
            /*for(let i = 0; i < content.length; i++){
                results.push(content[i]);
            }*/
            
            if(localStorage.getItem('fromFile')){
                this.results = JSON.parse(localStorage.getItem('fromFile'));
            }
            
            this.start();

        }).done()
    }

    start() {
        console.log("Starting");
        $('#generate').on('click', ()=>{this.generateCalculations();});
        $('#check').on('click', ()=>{this.checkCalculations();});
        $('#scoreboard').on('click', ()=>{this.showScoreBoard();});
    }

    generateCalculations(){
        console.log("generating");
        var calculations = document.getElementById("calculations");
        calculations.innerHTML="";
    
        for(var i = 0; i < 10; i++){
            var calculation = document.createElement("div");
            var textarea  = document.createElement("textarea");
            textarea.id = i;
            textarea.cols = 3;
            textarea.rows = 1;
            var calculationType = Math.floor(Math.random()*3);
            var number;
            var number2;
    
            if(calculationType == 0){
                number = Math.floor(Math.random() * 20 + 1);
                number2 = Math.floor(Math.random() * 20 + 1);
                textarea.solution = number + number2;
                calculation.innerHTML = number + " + " + number2 + " = ";
            }
    
            else if(calculationType == 1){
                number = Math.floor(Math.random() * 25 + 1);
                number2 = Math.floor(Math.random() * 20 + 1);
                textarea.solution = number - number2;
                calculation.innerHTML = number + " - " + number2 + " = ";
            }
            else if(calculationType == 2){
                number = Math.floor(Math.random() * 15 + 1);
                number2 = Math.floor(Math.random() * 15 + 1);
                textarea.solution = number * number2;
                calculation.innerHTML = number + " * " + number2 + " = ";
            }
            /* Kuna jagamis tehted tekitasid vahel liiga suuri ujukoma arve
            otsustasin jagamis tehted 2ra j2tta*/
            /*else if(calculationType == 3){
                number = Math.floor(Math.random() * 100 + 1);
                number2 = Math.floor(Math.random() * 20 + 1);
                textarea.solution = Math.floor(number / number2);
                calculation.innerHTML = number + " / " + number2 + " = ";
            }*/
    
            calculation.append(textarea);
            calculation.append(document.createElement("br"));
            calculation.append(document.createElement("br"));
            calculations.append(calculation);
        }
    }

}

let typer = new Calc(name);