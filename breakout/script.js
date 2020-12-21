var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 7;
var dy = -5;
var ballRadius = 18;

//Get a random color when the ball hits the wall
var hex;
var color = randomColor();

var paddleHeight = 15;
var paddleWidth = 120;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 5;
var brickColumnCount = 8;
var brickWidth = 54;
var brickHeight = 20;
var brickPadding = 12;
var brickOffsetTop = 85;
var brickOffsetLeft = 40;

var score = 0;

var lives = 1;

// Trying audio (again)
var bgSound = new Audio("Mountain Audio - Suspense Rhythm.mp3");
var hitBrick = new Audio("Noise Hit Game 03 SHORTENED.mp3");
var gameOver = new Audio("Game Over Sci-Fi.wav");
var hitPaddle = new Audio("Flash Hit.wav");

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#FF003F";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function randomColor() {
  hex = Math.floor(Math.random() * 1000000) + 1;
  color = "" + "#" + hex + "";
  return color;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawGameTitle();
  collisionDetection();
  x += dx;
  y += dy;

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    color = randomColor();
    ctx.fillStyle = color;
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      hitPaddle.play();
    } else {
      //Code for lives
      lives--;
      if (!lives) {
        gameOver.play();
        alert("You failed us... Our world will be destroyed.");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX += 6;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 6;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        bgSound.play();
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          hitBrick.play();
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("Yay, you saved our world!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "20px Murray Inline Grunge";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "20 Murray Inline Grunge";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawLives() {
  ctx.font = "20 Murray Inline Grunge";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Lives: " + lives, canvas.width - 66, 20);
}

function drawGameTitle() {
  ctx.font = "22 Mecha Grunge";
  ctx.fillStyle = "#AFEEEE";
  ctx.fillText(
    "Space Force II: Revenge of the White Blocks",
    canvas.width - 480,
    20
  );
}

draw();
