var cookies = 0;
var clicks = 0;

$(document).ready(function(){


    $("#cookie").on('click', function(){
        clicks+=1;
        let cookiesNr = 1000;
        document.getElementById('clicks').innerHTML = "Klikke tehtud: " + clicks;

        if(clicks<=10){
            cookies+=1;
        }else if(cookies==10){
            alert("Palju õnne! \nVanaema aitab küpsetada!")
            cookies+=5;
        }else if(cookies>10 && cookies<100){
            cookies+=5;
        }else if(cookies==100){
            alert("Palju õnne! \nFarmis valmivad küpsised kiirelt!")
            cookies+=10;
        }else if(cookies>100 && cookies<500){
            cookies+=10;
        }else if(cookies==500){
            alert("Palju õnne! \nNüüd on sul kaevandus!")
            cookies+=50;
        }else if(cookies>500){
            cookies+=50;
        }else if(cookies==500){
            alert("Kliki kuni jaksad!")
        }
        document.getElementById('cookies').innerHTML = "Küpsiseid: " + cookies;
    })
     
});