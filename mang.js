var cookies = 0;
var clicks = 0;
var grandmas = 0;
var farms = 0;
var mines = 0;
var grandmaPrice = 5;
var farmPrice = 50;
var minePrice = 200;
let cookieDiv = document.getElementById('cookies');

$(document).ready(function(){


    $("#cookie").on('click', function(){
        clicks+=1;
        document.getElementById('clicks').innerHTML = "Klikke tehtud: " + clicks;
        cookies+=1;


        /* if(cookies<=10){
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
        } */
        cookieDiv.innerHTML = "Küpsiseid: " + cookies;
    })
    
    $("#grandma").on('click', function(){
        if(cookies<grandmaPrice){
            alert("Sul on liiga vähe küpsiseid vanaema jaoks")
        }else{
            cookies = cookies-grandmaPrice;
            cookieDiv.innerHTML = "Küpsiseid: " + cookies;
            grandmas+=1;
            document.getElementById('grandmaNr').innerHTML = grandmas;
            grandmaPrice = Math.round(grandmaPrice*1.1);
            document.getElementById('grandmaPrice').innerHTML = grandmaPrice;
        }
    })
    $("#farm").on('click', function(){
        if(cookies<farmPrice){
            alert("Sul on liiga vähe küpsiseid farmi jaoks")
        }else{
            cookies = cookies-farmPrice;
            cookieDiv.innerHTML = "Küpsiseid: " + cookies;
            farms+=1;
            document.getElementById('farmNr').innerHTML = farms;
            farmPrice = Math.round(farmPrice*1.1);
            document.getElementById('farmPrice').innerHTML = farmPrice;
        }
    })
    $("#mine").on('click', function(){
        if(cookies<minePrice){
            alert("Sul on liiga vähe küpsiseid kaevanduse jaoks")
        }else{
            cookies = cookies-minePrice;
            cookieDiv.innerHTML = "Küpsiseid: " + cookies;
            mines+=1;
            document.getElementById('mineNr').innerHTML = mines;
            minePrice = Math.round(minePrice*1.1);
            document.getElementById('minePrice').innerHTML = minePrice;
        }
    })
});
updateCookies();
setInterval(updateCookies, 1000);
function updateCookies(){
    cookies = cookies+grandmas+farms*10+mines*50;
    cookieDiv.innerHTML = "Küpsiseid: " + cookies;

}