let name = prompt("Sisesta oma nimi")


class Script{
    constructor(name){
        this.name = name;
        this.n1;
        this.n2;
        this.tehe;
        this.result;
        this.signs = ["+", "-"];
        this.sign;
        this.init();
        this.Answer;
        this.playerAnswer = "";
        this.start = 0;
        this.end = 0;
        this.i = 0
        this.time;
        this.results = [];
        this.loadFromFile();
    }

    //laeb andmebaasist tulemused
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
        this.generateEquation();
        $('#show-results').on('click', ()=>{this.showResults();});
        if(localStorage.getItem('score')){
            this.results = JSON.parse(localStorage.getItem('score'));
        } else {
            console.log('else see');
        }
    }
    //genereerin vorrandi
    generateEquation(){
        this.n1 = Math.floor(Math.random() * 100)
        this.n2 = Math.floor(Math.random() * 100)
        this.sign = this.signs[Math.floor(Math.random()*this.signs.length)];
        this.tehe = this.n1 + " " + this.sign + " " + this.n2;
        this.writeEquation(this.tehe);
        console.log(this.sign);
    }
    //kuvan vorrandi lehele
    writeEquation(){
        $('#equations').html(this.tehe);
        this.solveEquation();
    }
    //arvutan vorrandi tulemuse
    solveEquation(){
        if (this.sign == "+"){
            this.Answer = this.n1 + this.n2;
            console.log(this.Answer);
        } else if (this.sign == "-"){
            this.Answer = this.n1 - this.n2;
            console.log(this.Answer);
        }
        this.startPlayer();
    }

    //alustan m2ngu
    startPlayer(){
        this.start = performance.now();
        console.log(this.start)
        $(document).on('keypress', (event) => this.solvedEquation(event.key));
    }

    //loen kasutaja vastuse
    solvedEquation(keypressed){
        const length = (JSON.stringify(this.Answer).length)
        if (this.i < length){
            this.playerAnswer += keypressed;
            this.i++
            $('#answer').html(this.playerAnswer)
        }
        if (this.i === length){
            this.showAnswer();
        }
    }

    //vordlen kasutaja vastust oige vastusega
    showAnswer(){
        console.log("labi")
        this.end = performance.now()
        this.time = ((this.end - this.start)/1000).toFixed(2)
        console.log(this.time)
        if (this.Answer == this.playerAnswer){
            $('#response').html("Õige vastus " + name +", sinu aeg oli " + ((this.end - this.start)/1000).toFixed(2))
            if (this.time < 5.0){
                $('#respn').html("Oled päris hea matemaatik!")
            }
            this.saveResult();
        } else {
            $('#response').html("Proovi uuesti " + name +", sinu aeg oli " + ((this.end - this.start)/1000).toFixed(2))
        }
        $('#equations').html("Uue mängu alustamiseks vajuta enter!")

        $(document).on('keypress', (event) => this.startGameWithEnter(event.keyCode));
    }

    //uue mangu alustamiseks vajuta enter
    startGameWithEnter(keyPressed){
        console.log(keyPressed);
        if (keyPressed == 13){
            location.reload();
        }
    }

    //SERVERI POOLSEL SUHTLUSEL KASUTASIN TUNNIS KIRJUTATUD KOODI
    //SALVESTAMINE
    saveResult(){
        let result = {
            name: this.name,
            time: ((this.end-this.start)/1000).toFixed(2)
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
            console.log("AJAX TÖÖTAB LÕPUKS");
        });
    }

    //TULEMUSTE KUVAMINE
    showResults(){
        $('#results').fadeToggle();
        console.log('toon peidust välja');
        $('#results').html("");
        for (let i = 0; i < this.results.length; i++){
            if(i == 10){break;}
            $('#results').append((i+1) + ". " + this.results[i].name + " " + this.results[i].time + "<br>");
        }
    }
}

let game = new Script(name);
