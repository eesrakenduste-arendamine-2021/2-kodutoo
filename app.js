let name = prompt('enter your name: ');

class Cookies{
    constructor(name){
        this.name = name;
        this.cookieAmount = 0;
        this.cookieIncome = 0;
        this.classLow = new Low();
        this.classMedium = new Mid();
        this.classHigh = new High();
        this.results = [];
        this.loadFromFile();
    }

    Income(){
        this.cookieAmount += this.cookieIncome;
    }

    loadFromFile(){
        $.get('db.txt', (data) => {
            let content = JSON.parse(data).content;
            this.results = content;
            console.log(content);
            this.results.forEach(result => {
                if(this.name === result.name){
                    this.classLow.counter = +result.classLow.counter;
                    this.classLow.amountIncome = +result.classLow.amountIncome;
                    this.classLow.amountPrice = +result.classLow.amountPrice;

                    this.classMedium.counter = +result.classMedium.counter;
                    this.classMedium.amountIncome = +result.classMedium.amountIncome;
                    this.classMedium.amountPrice = +result.classMedium.amountPrice;

                    this.classHigh.counter = +result.classHigh.counter;
                    this.classHigh.amountIncome = +result.classHigh.amountIncome;
                    this.classHigh.amountPrice = +result.classHigh.amountPrice;

                    this.cookieAmount = +result.cookieAmount;
                    this.cookieIncome = +result.cookieIncome;
                }
            });
        }).done();
    }

    saveToFile(){
        let result = {
           name: this.name,
           cookieAmount: this.cookieAmount,
           cookieIncome: this.cookieIncome,
           classLow: this.classLow,
           classMedium: this.classMedium,
           classHigh: this.classHigh
        }

        this.results.push(result);
        this.results.sort((a, b) => a.cookieAmount - b.cookieAmount);

        $.post('server.php', {save: this.results}).done(function(){
            console.log('Success');
        }).fail(function(){
            alert('FAIL');
        }
        ).always(function(){
            console.log("Tegime midagi AJAXiga");
        });
    }

}
class Low{
    counter = 0;
    basePrice = 10;
    amountPrice = 10;
    amountIncome = 1;
    
    Buy(cookie){
        this.counter++;
        console.log(this.counter);
        cookie.cookieIncome += this.amountIncome;
        cookie.cookieAmount -= this.amountPrice;
        this.amountPrice += this.basePrice;
    }   
}
class Mid extends Low{
    counter = 0;
    amountPrice = 110;
    basePrice = 110;
    amountIncome = 10;
}
class High extends Low{
    counter = 0;
    basePrice = 1100;
    amountPrice = 1100;
    amountIncome = 100;
}

let cookie = new Cookies(name);

let [income, total] = document.getElementsByClassName('score');

let [low, medium, high] = document.getElementsByClassName('price');

let buttons = Array.from(document.getElementsByClassName('buy'));

function buyLow(){
    cookie.classLow.Buy(cookie);
    update();
}

function buyMid(){
    cookie.classMedium.Buy(cookie);
    update();
}

function buyHigh(){
    cookie.classHigh.Buy(cookie);
    update();
}

function update(){
    buttons.forEach(button => {
        if(cookie.cookieAmount < button.childNodes[1].textContent){
            
            button.disabled = true;
        }else{
            button.disabled = false;
        }
    });

    low.textContent = cookie.classLow.amountPrice;
    medium.textContent = cookie.classMedium.amountPrice;
    high.textContent = cookie.classHigh.amountPrice;

    income.textContent = `Income: ${cookie.cookieIncome}`;
    total.textContent = `Total: ${cookie.cookieAmount}`;
}

function gameLoop(){
    
    cookie.Income();
    update();
    

}

function basicIncome(){
    cookie.cookieAmount += 1;

    update();
}
function saveToFile(){
    cookie.saveToFile();
}
update();
gameLoop();
setInterval(gameLoop, 1000);