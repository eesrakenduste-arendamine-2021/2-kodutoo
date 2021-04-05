// Nii klassis kui ka väljaspool seda on mõningad funktsioonid antud veebisaidilt:
// https://ourcodeworld.com/articles/read/185/how-to-get-the-pixel-color-from-a-canvas-on-click-or-mouse-event-with-javascript
// Laenatud funktsioone on pea igaüht mingil määral muudetud vastavalt mullle sobivaks ja vajalikuks
// Laenatud koodi ülesanne on tuvastada hiire all parasjagu oleva piksli koordinaat ja värv
// Neid andmeid kasutan mängu hit detectionina. Ise ei osanud sellist süsteemi välja mõelda

class maze {
    constructor() {
        this.loadBestTime();
        this.startButton();

        document.addEventListener('contextmenu', event => event.preventDefault());

        $("#gameArea").css("display", "none");

        this.canvas = document.getElementById("gameArea");
        this.context = this.canvas.getContext("2d");
        this.level = 1;

        //context.fillStyle = "gray";
        //context.fillRect(0, 0, canvas.width, canvas.height);
        this.drawImg();
    }

    loadBestTime() {
        var timesTypeChanged = [];
        $.get("database.txt", async (data) => {
            var times = data.split(", ");
            for(let i = 0; i < (times.length - 1); i++) {
                var typeChanged = parseFloat(times[i]);
                timesTypeChanged.push(typeChanged);
            }
            $(".bestTime").html(Math.min.apply(null, timesTypeChanged) + " sekundit");
            $(".bestTime").css("color", "black");
            $(".worstTime").html(Math.max.apply(null, timesTypeChanged) + " sekundit");
            $(".worstTime").css("color", "black");
        }).done();
    }

    startButton() {
        $(".startButton").on("click", function(startButtonFunc) {
            startButtonFunc();
        }, this.startButtonFunc);
    }

    startButtonFunc() {
        $(".gameArea").css("display", "none");
        $("#title").css("display", "none");
        $("#gameArea").css("display", "block");
        $("#gameArea").css("cursor", "url(img/cursor.png), auto");
        $("#timer").css("display", "block");

        var startTime = Date.now();

        timerInterval = setInterval(function() {
            var elapsedTime = Date.now() - startTime;
            $("#timer").html((elapsedTime / 1000).toFixed(3));
        }, 10);
    }

    stopTimer() {
        clearInterval(timerInterval);
    }

    drawImg() {
        var image = new Image();
        image.src = "img/" + this.level + ".png";
        image.onload = function() {
            context.drawImage(image, 0, 0);
        }
    }

    rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    getEventLocation(element, event) {
        var pos = this.getElementPosition(element);
    
        return {
                x: (event.pageX - pos.x),
            y: (event.pageY - pos.y)
        };
    }

    getElementPosition(obj) {
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    }

    saveResult() {
        let result = parseFloat($("#timer").html());
        
        $.post("server.php", {save: result}).done(function() {
            console.log("aeg salvestatud");
        }).fail(function() {
            console.log("aja salvestamine ebaõnnestus");
        });
    }
}

var timerInterval;

let Maze = new maze();

let lvl1change = true;
let lvl2change = true;
let lvl3change = true;

var canvas = document.getElementById("gameArea");
var context = this.canvas.getContext("2d");

canvas.addEventListener("mousemove", function(e) {
	var eventLocation = Maze.getEventLocation(this, e);
    var coord = "x=" + eventLocation.x + ", y=" + eventLocation.y;
    
    var context = this.getContext('2d');
    var pixelData = context.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 
    
    var hex = "#" + ("000000" + Maze.rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
    
    //console.log(coord);
    //console.log(hex);

    if(hex == "#ffffff") {
        window.location.reload();
    }

    var xValue = parseInt(coord.slice(2, 5));
    var yValue = parseInt(coord.slice(9, 12));

    if(hex == "#ff7f27" && Maze.level == 1 && lvl1change == true) {
        Maze.level++;
        Maze.drawImg();
        lvl1change = false;
    }

    if(yValue > 600 && hex == "#ff7f27" && Maze.level == 2 && lvl2change == true) {
        Maze.level++;
        Maze.drawImg();
        lvl2change = false;
    }

    if(xValue > 590 && Maze.level == 3 && lvl3change == true) {
        Maze.level++;
        lvl3change = false;
        Maze.stopTimer();
        Maze.saveResult();
        var audio = new Audio("sound/sound.mp3");
        audio.play();
        Maze.drawImg();
        canvas.requestPointerLock();
    }

}, false);