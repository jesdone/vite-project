// Jes Donnelly
// Brick Breaker React

//-------------------------
// GLOBAL VARIABLES
//-------------------------
let x: number = 200; // starting horizontal position of ball
let y: number = 150; // starting vertical position of ball
let dx: number = 1; // amount ball should move horizontally
let dy: number = -3; // amount ball should move vertically
// variables set in init()
let ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  paddlex: number,
  bricks: boolean[][],
  brickWidth: number;
let paddleh: number = 10; // paddle height (pixels)
let paddlew: number = 75; // paddle width (pixels)
let canvasMinX: number = 0; // minimum canvas x bounds
let canvasMaxX: number = 0; // maximum canvas x bounds
let intervalId: number = 0; // track refresh rate for calling draw()
let nrows: number = 7; // number of rows of bricks
let ncols: number = 7; // number of columns of bricks
let brickHeight: number = 15; // height of each brick
let padding: number = 1; // how far apart bricks are spaced

let ballRadius: number = 10; // size of ball (pixels)
// change colors of bricks -- add as many colors as you like
let brick_colors: string[] = ["red", "gold", "green", "black"];
let paddlecolor: string = "orange";
let ballcolor: string = "brown";
let backcolor: string = "lightBlue";
let score: number = 0; // store the number of bricks eliminated
let paused: boolean = false; // keeps track of whether the game is paused (true) or not (false)

//-------------------------
// FUNCTION DECLARATIONS
//-------------------------
// initialize game
function init(): void {
  //get a reference to the canvas
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  ctx = canvas.getContext("2d")!;
  width = canvas.width;
  height = canvas.height;
  paddlex = width / 2;
  brickWidth = width / ncols - 1;
  canvasMinX = canvas.offsetLeft;
  canvasMaxX = canvasMinX + width;
  // run draw function every 10 milliseconds to give
  // the illusion of movement
  init_bricks();
  start_animation();
}

function reload(): void {
  x = 200; // starting horizontal position of ball
  y = 150; // starting vertical position of ball
  dx = 1; // amount ball should move horizontally
  dy = -3; // amount ball should move vertically
  score = 0; // reset the score to zero
  update_score_text(); // update the displayed score
  init_bricks();
}

// used to draw the ball
function circle(x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

// used to draw each brick & the paddle
function rect(x: number, y: number, w: number, h: number): void {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.closePath();
  ctx.fill();
}

// clear the screen in between drawing each animation
function clear(): void {
  ctx.clearRect(0, 0, width, height);
  rect(0, 0, width, height);
}

// What to do when the mouse moves within the canvas
function onMouseMove(evt: MouseEvent): void {
  // set the paddle position if the mouse position
  // is within the borders of the canvas
  if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
    paddlex = Math.max(evt.pageX - canvasMinX - paddlew / 2, 0);
    paddlex = Math.min(width - paddlew, paddlex);
  }
}

function onKeyPress(evt: KeyboardEvent): void {
  evt.preventDefault();
  pause();
  if (evt.key === "r" || evt.key === "R") {
    evt.preventDefault();
    reload();
  }
}

// main functionality begins here
// what should happen when the user moves the mouse?
document.addEventListener("mousemove", onMouseMove); // register the mouse move function
document.addEventListener("keypress", onKeyPress); // register onKeyPress function
init(); // initialize & begin game

let pausedState: {
  x: number;
  y: number;
  dx: number;
  dy: number;
  score: number;
  bricks: boolean[][];
} | null = null; // Variable to store the state when paused

function pause(): void {
  paused = !paused;
  if (paused) {
    //clearInterval(intervalId); // Stop the animation
    pausedState = { x, y, dx, dy, score, bricks }; // Save the current state
  } else {
    if (pausedState) {
      // Resume the animation with the saved state
      ({ x, y, dx, dy, score, bricks } = pausedState);
      update_score_text(); // Update the displayed score
      start_animation();
    }
  }
}

// initialize array of bricks to be visible (true)
function init_bricks(): void {
  bricks = new Array(nrows);
  for (let i = 0; i < nrows; i++) {
    // for each row of bricks
    bricks[i] = new Array(ncols);
    for (let j = 0; j < ncols; j++) {
      // for each column of bricks
      bricks[i][j] = true;
    }
  }
}

// render the bricks
function draw_bricks(): void {
  for (let i = 0; i < nrows; i++) {
    // for each row of bricks
    for (let j = 0; j < ncols; j++) {
      // for each column of bricks
      // set the colors to alternate through
      // all colors in brick_colors array
      // modulus (%, aka remainder) ensures the colors
      // rotate through the whole range of brick_colors
      ctx.fillStyle = brick_colors[(i + j) % brick_colors.length];
      if (bricks[i][j]) {
        rect(
          j * (brickWidth + padding) + padding,
          i * (brickHeight + padding) + padding,
          brickWidth,
          brickHeight
        );
      } // else if bricks[i][j] is false it's already been hit
    }
  }
}

function update_score_text(): void {
  // Update the displayed score
  $("#score").text("Score: " + score);
}

function draw(): void {
  // before drawing, change the fill color
  ctx.fillStyle = backcolor;
  clear();
  ctx.fillStyle = ballcolor;
  //draw the ball
  circle(x, y, ballRadius);
  ctx.fillStyle = paddlecolor;
  //draw the paddle
  rect(paddlex, height - paddleh, paddlew, paddleh);
  draw_bricks();

  //check if we have hit a brick
  const rowheight = brickHeight + padding;
  const colwidth = brickWidth + padding;
  const row = Math.floor(y / rowheight);
  const col = Math.floor(x / colwidth);
  //if so reverse the ball and mark the brick as broken
  if (y < nrows * rowheight && row >= 0 && col >= 0 && bricks[row][col]) {
    dy = -dy;
    bricks[row][col] = false;
    bricks[row][col] = false;
    score += 1; // Increment the score
    update_score_text(); //update displayed score
  }

  //contain the ball by rebounding it off the walls of the canvas
  if (x + dx > width || x + dx < 0) dx = -dx;

  if (y + dy < 0) {
    dy = -dy;
  } else if (y + dy > height - paddleh) {
    // check if the ball is hitting the paddle and if it is, rebound it
    if (x > paddlex && x < paddlex + paddlew) {
      dy = -dy;
    }
  }
  if (y + dy > height) {
    //game over, so stop the animation
    stop_animation();
  }
  x += dx;
  y += dy;
}

function start_animation(): void {
  intervalId = setInterval(draw, 20);
}

function stop_animation(): void {
  clearInterval(intervalId);
  // Added this line to clear the canvas when the animation stops
  clear();
}

//-------------------------
// MAIN EXECUTION
// (CALLING FUNCTIONS)
//-------------------------
// main functionality begins here
// what should happen when the user moves the mouse?
document.addEventListener("mousemove", onMouseMove); // register the mouse move function
document.addEventListener("keypress", onKeyPress); // register onKeyPress function
init(); // initialize & begin game
