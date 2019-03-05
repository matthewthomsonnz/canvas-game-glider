class GliderGame {
	constructor(props = {}) {
		Object.assign(this, {
			glider: {},
			keyDown: {},
			canvas: {},
			currentLevel: 0,
			requestAnimationFrame: window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
			returnAllObstacles: function(){
				let obj = {}
				var children = [].slice.call(document.getElementById("svg").children).forEach(function(svgElement){
					let eachObstacle = {};
					eachObstacle.elem = svgElement;
					eachObstacle.boundaries = JSON.parse("[" +svgElement.getAttribute('data-boundaries')+ "]");
					eachObstacle.svg = new Image();
					eachObstacle.svg.src = "data:image/svg+xml;base64,"+btoa(eachObstacle.elem.outerHTML);
					eachObstacle.x = 50;
					eachObstacle.y = 20;
					eachObstacle.start = 0;
					eachObstacle.isObstacle = svgElement.getAttribute('data-obstacle');
					eachObstacle.w = parseInt(svgElement.getAttribute('width'));
					eachObstacle.h = JSON.parse(svgElement.getAttribute('data-height'));
					eachObstacle.peak = eachObstacle.right = eachObstacle.left = false;
					obj[svgElement.id] = eachObstacle;

				});
				return obj;
			},
			obstacles: null
		});
		this.obstacles = this.returnAllObstacles();
		this.init();
		document.addEventListener('keyup', this.key.bind(this), false);
		document.addEventListener('keydown', this.key.bind(this), false);
	}
	make(obstacles) {
		obstacles.forEach((obstacle) => {
			var [x, y, enemy] = obstacle;
			if (enemy.elem.id == "balloon") {
				y = enemy.y+= -3;
				if (enemy.y <= -100) {
					enemy.y = this.canvas.elem.height; 
					enemy.start = 0
					enemy.x = Math.floor(Math.random()*1280)
					enemy.start++
				}
				x = enemy.x;
			}
		if (enemy.elem.id == "helicopter") {
			y = enemy.y+= 5;
			x = enemy.x += -6
			if (enemy.y >= this.canvas.elem.height) {
				enemy.y = -100; 
				enemy.start = 0
				enemy.x = Math.floor(Math.random()*1280)
				enemy.start++
			}
			x = enemy.x;
			 y= enemy.y;
		}
		this.canvas.context.drawImage(enemy.svg, x, y);
		if (enemy.elem.id == "vent") {
			if (this.obstacles.glider.x >= x-70 && this.obstacles.glider.x <= x+70) {
				if (this.obstacles.glider.y >= 60) {
					this.obstacles.glider.y -= 7;
				}
			}
			return;
		}
		const plane = this.obstacles.glider;
		if (enemy.isObstacle == "true") {
				if (plane.x+plane.w >= x && x+enemy.w >= plane.x) {
						if(plane.y+plane.h >= y && y+enemy.h >= plane.y) this.minusLife();
					}
			}
		});
	}
	levels(){
		let levelObstacles;
		let ob = this.obstacles;
		switch (this.currentLevel) {
		case 0:
			levelObstacles = [[150,670,ob.vent], [410,450,ob.table], [420, 295, ob.computer], [850, 396, ob.clock], [1040, 670, ob.vent], [222, 109, ob.cracks]];
			if (this.obstacles.glider.x < 20) this.obstacles.glider.x += 7;
		break;
		case 1:
			levelObstacles = [[150, 670, ob.vent], [1040, 670, ob.vent], [480, 230, ob.shelf], [480, 127, ob.books], [600, 127, ob.books], [799, 177, ob.clock], [222, 109, ob.pipe]];
		break;
		case 2:
			levelObstacles = [[150, 670, ob.vent], [840, 670, ob.vent], [1090, 670, ob.vent], [482, 450, ob.table], [500, 397, ob.clock]];
		break;
		case 3:
			levelObstacles = [[110, 670, ob.vent], [280, 445, ob.cabinet], [482, 160, ob.shelf], [820, 122, ob.battery], [940, 670, ob.vent]];
		break;
		case 4:
			levelObstacles = [[150, 670, ob.vent], [440, 450, ob.table], [500, 397, ob.clock], [810, 57, ob.wallcabinet], [1040, 670, ob.vent], [1, 670, ob.balloon]];
		break;
		case 5:
		  levelObstacles = [[230, 670, ob.vent], [512, 383, ob.candle], [400, 450, ob.table], [690, 346, ob.books], [1040, 670, ob.vent], [500, 500, ob.helicopter]];
		break;
		case 6:
		levelObstacles = [];
		}
		this.make(levelObstacles);
	}
	init(){
		this.canvas.elem = document.getElementsByTagName("canvas")[0];
		this.canvas.context = this.canvas.elem.getContext('2d');
		this.canvas.w = this.canvas.elem.width;
		this.canvas.h = this.canvas.elem.height;
		this.returnAllObstacles();
		this.startAnimate();
	}
	render() {
		const c = this.canvas.context
		c.clearRect(0, 0, c.canvas.width, c.canvas.height);
		c.fillStyle = "#ffff9f";
		c.fillRect(0, 0, c.canvas.width, 100);
		c.fillStyle = "#c3c380";
		c.fillRect(0, 100, c.canvas.width, c.canvas.height-100);
		c.fillStyle = "#5a5aa8";
		c.fillRect(0, c.canvas.height-100, c.canvas.width, 100);
		c.fillStyle = "#E16200";
		c.fillRect(0,100,c.canvas.width,10);
		c.fillRect(0,580,c.canvas.width,50);
		c.strokeStyle = "#000";
		c.lineWidth   = 3;
		c.strokeRect(-10,100,c.canvas.width+20,10);
		c.strokeRect(-10,580,c.canvas.width+20,20);
		c.strokeRect(-10,580,c.canvas.width+20,50);
		this.levels();
		c.drawImage(this.obstacles.glider.svg, this.obstacles.glider.x, this.obstacles.glider.y);
	}
	gliderPosition(){
		this.obstacles.glider.y <= this.canvas.h-60 ? this.obstacles.glider.y += 3 : this.minusLife();
		this.keyDown.d == true ? this.obstacles.glider.x += 6 : null;
		this.keyDown.a == true ? this.obstacles.glider.x -= 6 : null;
		if (this.obstacles.glider.x >= this.canvas.w-100) {
			this.currentLevel++;
			this.obstacles.glider.x = 50;
		};
		if (this.obstacles.glider.x <= 0) {
			this.currentLevel--;
			this.obstacles.glider.x = this.canvas.w-120;
		};
	}
	key(e) {
		let down;
		event.type == "keydown" ? down = true : down = false;
		switch (event.key) {
		case "A": case "a":
			this.keyDown.a = down;
			break;
		case "D": case "d":
			this.keyDown.d = down;
			break;
		};
	}
	minusLife(){
		this.obstacles.glider.y = this.obstacles.glider.x=40;
	}
	startAnimate () {
		requestAnimationFrame(this.startAnimate.bind(this));
		this.gliderPosition();
		this.render();
	};
}
new GliderGame();
