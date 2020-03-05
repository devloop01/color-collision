console.clear();

import Ball from "./ball.js";
import { randomFromArray, randomFloatFromRange } from "./utils.js";

// calling the spliiting function
Splitting();

// Selecting the canvas
const canvas = document.querySelector("[data-canvas]");
// getting its context
const ctx = canvas.getContext("2d");

// Setting its width and height
let canvasMaxHeight = 800,
	canvasWidth = 400,
	canvasHeight = innerHeight - 50 > canvasMaxHeight ? canvasMaxHeight : innerHeight - 50;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let retryBtn = document.querySelector(".retry-btn");
let retryText = document.querySelector(".retry-text");
let playBtn = document.querySelector(".btn.play");
let startScreen = document.querySelector(".start-screen");

// Initializing everything

let balls = [], // balls array
	particles = []; // sparks array
var redBall, blueBall; // the TWO cantral balls
var separation = 35; // separation between central balls
var globalRadius = 18; // radius for all the Balls
let generateBall = false; // generate a new ball or not
let timeInterval;
let velocityOfBall; // velocity of the ball
let failed = false; // game failed or not
let timer = 0; // timer (increments every 1ms)
let score = 0; // score counter
let fillColor; // Text fill color
// colors array
var colors = ["#e74c3c", "#3498db"];
// random points where the ball would generate and start moving
let randPoints;

// Function that initializes the canvas
function init() {
	balls = [];
	particles = [];
	uselessBalls = [];
	generateBall = true;
	timeInterval = 2000;
	timer = 0;
	velocityOfBall = 2.5;
	score = 0;
	fillColor = "#fff";

	blueBall = new Ball(
		canvas,
		ctx,
		canvasWidth / 2,
		canvasHeight / 2 - separation,
		globalRadius,
		colors[1],
		particles,
		0,
		0,
		true
	);
	redBall = new Ball(
		canvas,
		ctx,
		canvasWidth / 2,
		canvasHeight / 2 + separation,
		globalRadius,
		colors[0],
		particles,
		0,
		0,
		true
	);
	balls.push(redBall, blueBall);

	randPoints = [
		{
			x: canvas.width / 2,
			y: -50,
		},
		{
			x: canvas.width / 2,
			y: canvas.height + 50,
		},
	];
}

// This is an array for a bunch of useless balls on the start of the game
var uselessBalls = [];
// This function will push many useless balls balls to the useless array and then push all the useless balls to the default ballas array
function initUseless() {
	for (let i = 0; i < 20; i++) {
		let randVelXY = {
			x: randomFloatFromRange(-5, 5),
			y: randomFloatFromRange(-5, 5),
		};
		let r = randomFloatFromRange(5, 10);
		uselessBalls.push(
			new Ball(
				canvas,
				ctx,
				canvasWidth / 2,
				canvasHeight / 2,
				r,
				colors[Math.floor(Math.random() * colors.length)],
				particles,
				randVelXY.x,
				randVelXY.y,
				true
			)
		);
	}
	balls.push([...uselessBalls]);
}
// calling it on execution of code
initUseless();

// initialiazing the background in a variable
var background = BG_Gradient("#2c3e50", "#34495e");

// this func. calls itself again and again every 60ms and is the reason you can play this game
function loop() {
	// func. that will call itself
	requestAnimationFrame(loop);

	// seting the background
	ctx.fillStyle = background;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// setting the scorecard
	ctx.fillStyle = fillColor;
	ctx.font = "21px sans-serif";
	ctx.fillText(`SCORE : ${score.toString()}`, 20, 35);

	// updating every uselessballs
	uselessBalls.forEach(ball => {
		ball.update(balls, true);
		ball.edgeDetect();
	});
	if (uselessBalls.length != 0) {
		return;
	}

	// updating every balls in the balls array
	if (balls.length != 0) {
		balls.forEach((ball, index) => {
			ball.update(balls);
			if (ball.collided == true) {
				score += 10;
				fillColor = ball.color;
			}
			if (ball.opacity <= 0) {
				ball.dontCheck = true;
				balls.splice(index, 1);
			}
		});
	}
	if (balls.length == 0 || balls.length == 1) {
		failed = true;
		generateBall = false;
	}
	if (balls.length == 2) {
		generateBall = true;
	}
	if (timeInterval % timer == 0 && generateBall == true) {
		generateBall = false;
		pushNewBalls();
	}

	// updating every particles or sparks in the particles array
	if (particles.length != 0) {
		particles.forEach((particle, index) => {
			particle.update();
			if (particle.opacity <= 0.05) {
				particles.splice(index, 1);
			}
		});
	}

	// reseting the timer to 0 every 600ms
	if (timer == 600) {
		timer = 0;
	}

	// func. that is used to show and hide the UI options
	showHideOptions();
	// increment timer by 1 every 1ms
	timer++;
}
// calling the func. once will make the recurrsion possible which in return will start the animations
loop();

// Function that is used tto push new balls to the Balls array whenever called
function pushNewBalls() {
	var randomPoint = randomFromArray(randPoints),
		randomColor = randomFromArray(colors);
	balls.push(
		new Ball(
			canvas,
			ctx,
			randomPoint.x,
			randomPoint.y,
			globalRadius,
			randomColor,
			particles,
			0,
			velocityOfBall,
			false
		)
	);
}

// Func. to show and hide the UI
function showHideOptions() {
	if (failed == true && generateBall == false) {
		retryText.classList.remove("hide");
		retryText.classList.add("show");
		retryBtn.classList.remove("hide");
		retryBtn.classList.add("show");
	} else if (failed == false && generateBall == true) {
		retryText.classList.add("hide");
		retryText.classList.remove("show");
		retryBtn.classList.add("hide");
		retryBtn.classList.remove("show");
	}
}

// Func. that returns simple color gradient by providing two colors
function BG_Gradient(color1, color2) {
	let bg = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
	bg.addColorStop(0, color1);
	bg.addColorStop(1, color2);
	return bg;
}

// This will be called every 1000ms and the code would execute
setInterval(() => {
	if (velocityOfBall <= 7) {
		velocityOfBall += 0.08;
	} else {
		velocityOfBall += 0;
	}
}, 1500);

// EVENT LISTENERS

// Clicking on the canvas would change the color
canvas.addEventListener("mousedown", () => {
	redBall.change(colors[0], colors[1]);
	blueBall.change(colors[1], colors[0]);
});

// retry again by clicking the retry button
retryBtn.addEventListener("mousedown", () => {
	failed = false;
	init();
});

// Start playing now.
playBtn.addEventListener("mousedown", () => {
	startScreen.classList.add("hide");
	init();
});

window.addEventListener("resize", () => {
	if (canvasHeight >= canvasMaxHeight) {
		canvasHeight = canvasMaxHeight;
	} else {
		canvasHeight = innerHeight - 50;
	}
	console.log(canvasHeight);
	canvas.height = canvasHeight;
});
