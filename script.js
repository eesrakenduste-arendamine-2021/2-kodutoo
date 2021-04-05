$(document).ready(function(){
	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");
	var width = $("#canvas").width();
	var height = $("#canvas").height();

	var cw = 10;
	var direction;
	var food;
	var score;
    var snake;

    class Snake {
        constructor()
        {
            this.snake_array = [];
            $(document).keydown(function(e){
                var key = e.which;
        
                if(key == "37" && direction != "right") direction = "left";
                else if(key == "38" && direction != "down") direction = "up";
                else if(key == "39" && direction != "left") direction = "right";
                else if(key == "40" && direction != "up") direction = "down";
        
                else if(key == "87" && direction != "down") direction = "up";
                else if(key == "65" && direction != "right") direction = "left";
                else if(key == "68" && direction != "left") direction = "right";
                else if(key == "83" && direction != "up") direction = "down";
            })
        }
        createSnake(length)  {
            for(var i = length-1; i>=0; i--)
            {
                this.snake_array.push({x: i, y:0});
            }
        }
        getSnakeArray() {
            return this.snake_array;
        }
        setSnakeArray(newSnakeArray) {
            this.snake_array = newSnakeArray;
        }
         
    }
	
    class Food {
        constructor() {
            food = {
                x: Math.round(Math.random()*(width-cw)/cw), 
                y: Math.round(Math.random()*(height-cw)/cw), 
            };
        }
    }

	function initial()
	{
		direction = "right";
		create_food();
		score = 0;

        snake = new Snake();

        snake.createSnake(5);

		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 80);
	}
	initial();
	
	function create_food()
	{
		return new Food();
	}

	
	function paint()
	{
		context.fillStyle = "white";
		context.fillRect(0, 0, width, height);
		context.strokeStyle = "black";
		context.strokeRect(0, 0, width, height);

        snakeArray = snake.getSnakeArray();
		
		var nx = snakeArray[0].x;
		var ny = snakeArray[0].y;

		if(direction == "right") nx++;
		else if(direction == "left") nx--;
		else if(direction == "up") ny--;
		else if(direction == "down") ny++;
		
		if(nx == -1 || nx == width/cw || ny == -1 || ny == height/cw || check_collision(nx, ny, snakeArray))
		{
			initial();
			return;
		}
		
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score+= 1;
       
			create_food();
		}
		else
		{
			var tail = snakeArray.pop();
			tail.x = nx; tail.y = ny;
		}
		
		snakeArray.unshift(tail);
		
		for(var i = 0; i < snakeArray.length; i++)
		{
			var c = snakeArray[i];
			paint_cell(c.x, c.y, "#439122");
		}
		
		paint_cell(food.x, food.y, "#C80909");
		$('#score').text(score);
	}
	
	function paint_cell(x, y, color)
	{
		context.fillStyle = color;
		context.fillRect(x*cw, y*cw, cw, cw);
		context.strokeStyle = "#FFFFFF";
		context.strokeRect(x*cw, y*cw, cw, cw);
	}
	
	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	
})