// Obtenemos el elemento canvas y su contexto 2D
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Definimos las propiedades de la nave del jugador
const ship = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 40,
  height: 40,
  speed: 40,
};

// Array para almacenar los obstáculos
const obstacles = [];
let gameOver = false;
let obstacleSpeed = 2;
let obstacleSpawnRate = 0.02;
let score = 0;

let highScore = localStorage.getItem("highScore") || 0;

// Función para generar un nuevo obstáculo
function spawnObstacle() {
  const obstacle = {
    x: Math.random() * canvas.width,
    y: 0,
    width: 30 + Math.random() * 40,
    height: 30 + Math.random() * 40,
    speed: obstacleSpeed + Math.random() * 3,
    passed: false,
  };
  obstacles.push(obstacle);
}

// Función para dibujar la nave
function drawShip() {
  ctx.fillStyle = "#888";
  ctx.fillRect(ship.x - ship.width / 2, ship.y - ship.height / 2, ship.width, ship.height);
}

// Función para dibujar los obstáculos
function drawObstacles() {
  ctx.fillStyle = "#ff5555";
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x - obstacle.width / 2, obstacle.y - obstacle.height / 2, obstacle.width, obstacle.height);
  });
}

// Función principal de actualización del juego
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawShip();
  drawObstacles();

  // Aumentamos la dificultad a medida que el jugador sube de puntaje
  obstacleSpeed += 0.002;
  obstacleSpawnRate += 0.0002;

  if (!gameOver && Math.random() < obstacleSpawnRate) {
    spawnObstacle();
  }

  obstacles.forEach(obstacle => {
    obstacle.y += obstacle.speed;
    if (obstacle.y > canvas.height + obstacle.height / 2) {
      obstacles.splice(obstacles.indexOf(obstacle), 1);
    }

    const distX = Math.abs(obstacle.x - ship.x);
    const distY = Math.abs(obstacle.y - ship.y);
    if (distX < (obstacle.width + ship.width) / 2 && distY < (obstacle.height + ship.height) / 2) {
      gameOver = true;
      showGameOver();
    } else if (obstacle.y > ship.y + ship.height / 2 && !obstacle.passed) {
      obstacle.passed = true;
      score++;
    }
  });

  // Mostramos la puntuación en pantalla
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);

  if (!gameOver) {
    requestAnimationFrame(update);
  }
}

// Función para mostrar la pantalla de Game Over con efecto visual y mensaje de felicitación
function showGameOver() {
  const gameOverElement = document.getElementById("gameOverContainer");
  const restartButton = document.getElementById("restartButton");
  const resetScoreButton = document.getElementById("resetScoreButton");
  const finalScoreElement = document.getElementById("finalScore");
  const highScoreElement = document.getElementById("highScore");
  const congratulationMessage = document.getElementById("congratulationMessage"); // Nuevo elemento

  // Comparamos la puntuación actual con la puntuación máxima
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); // Guardamos el nuevo récord en el localStorage
    congratulationMessage.textContent = "¡Nuevo récord! ¡Felicidades!";
  } else {
    congratulationMessage.textContent = ""; // Borramos el mensaje si no hay nuevo récord
  }

  finalScoreElement.textContent = score;
  highScoreElement.textContent = highScore; // Mostramos la puntuación máxima

  // Agregamos una clase para el efecto de sacudida cuando colisiona
  document.body.classList.add("collision-effect");

  // Esperamos un tiempo antes de eliminar la clase para el efecto
  setTimeout(() => {
    document.body.classList.remove("collision-effect");
  }, 100);

  gameOverElement.classList.remove("hidden");
  restartButton.addEventListener("click", restartGame);
  resetScoreButton.addEventListener("click", resetScore);
}

// Función para reiniciar el juego
function restartGame() {
  const gameOverElement = document.getElementById("gameOverContainer");
  gameOverElement.classList.add("hidden");
  obstacles.length = 0;
  ship.x = canvas.width / 2;
  ship.y = canvas.height - 50;
  gameOver = false;
  obstacleSpeed = 2;
  obstacleSpawnRate = 0.02;
  score = 0;
  update();
}

// Función para reiniciar la puntuación
function resetScore() {
  localStorage.removeItem("highScore");
  highScore = 0;
  const highScoreElement = document.getElementById("highScore");
  highScoreElement.textContent = highScore;
}

// Manejador de eventos para las teclas de flecha
document.addEventListener("keydown", event => {
  if (!gameOver) {
    if (event.key === "ArrowLeft") {
      ship.x -= ship.speed;
    }
    if (event.key === "ArrowRight") {
      ship.x += ship.speed;
    }
    if (event.key === "ArrowUp") {
      ship.y -= ship.speed;
    }
    if (event.key === "ArrowDown") {
      ship.y += ship.speed;
    }
  }
});

// Iniciamos el ciclo de actualización del juego
update();
