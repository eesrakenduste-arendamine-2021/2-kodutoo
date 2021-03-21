$(document).ready(function(){

	var area = $("#gameArea")[0];
	var ctx = area.getContext("2d");
	var width = $("#gameArea").width();
	var height = $("#gameArea").height();
	var sqrw = 10, snake, direction, food, score;
	
function init(){
	direction = "right"; score = 0;
	makeSnake(); makeFood();
	if(typeof game_loop != "undefined") clearInterval(game_loop);
	game_loop = setInterval(paint, 100);
}
init();
	
function makeSnake(){
	var length = 5;
	snake = [];
	for(var i = length-1; i>=0; i--){
		snake.push({x: i, y:5});
	}
}
function makeFood(){
	food ={x: Math.round(Math.random()*(width-sqrw)/sqrw), y: Math.round(Math.random()*(height-sqrw)/sqrw),};
}
function paint(){
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, width, height);
	var gradient = ctx.createLinearGradient(0, 0, 170, 0);
	gradient.addColorStop("0", "#87CEFA");
	gradient.addColorStop("0.5", "#00BFFF");
	gradient.addColorStop("1.0", "#1E90FF");
	ctx.strokeStyle = gradient;
	ctx.lineWidth = 5;
	ctx.strokeRect(0, 0, width, height);	
	var nx = snake[0].x;
	var ny = snake[0].y;
	
	if(direction == "right") nx++;
	else if(direction == "left") nx--;
	else if(direction == "up") ny--;
	else if(direction == "down") ny++;
	
	if(nx == -1 || nx == width/sqrw || ny == -1 || ny == height/sqrw || collision(nx, ny, snake)){
		init();
		return;
    }
	if(nx == food.x && ny == food.y){
		var tail = {x: nx, y: ny};
		score++;
		length++;
		makeFood();
	}else{
		var tail = snake.pop();
		tail.x = nx; tail.y = ny;
	}
	snake.unshift(tail);
	for(var i = 0; i < snake.length; i++){
		var c = snake[i];
		paintSquare(c.x, c.y, "#87CEFA");
	}
	paintSquare(food.x, food.y, "#535050");
	var score_text = "Score: " + score;
	ctx.font = "20px Arial"
	ctx.fillText(score_text, width/2.3, height-375);
    }

function paintSquare(x, y, color){
	ctx.fillStyle = color;
	ctx.fillRect(x*sqrw, y*sqrw, sqrw, sqrw);
	ctx.strokeStyle = "white";
	ctx.strokeRect(x*sqrw, y*sqrw, sqrw, sqrw);
}	
function collision(x, y, array){
	for(var i = 0; i < array.length; i++){
		if(array[i].x == x && array[i].y == y)
			return true;
		}
		return false;
	}
$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && direction != "right") direction = "left";
		else if(key == "38" && direction != "down") direction = "up";
		else if(key == "39" && direction != "left") direction = "right";
		else if(key == "40" && direction != "up") direction = "down";
	})	
})
