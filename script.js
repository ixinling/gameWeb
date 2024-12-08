document.addEventListener('DOMContentLoaded', () => {
    // Time Display
    const timeDisplay = document.getElementById('current-time');
    let currentTime = new Date('2024-12-08T16:08:52+08:00');

    
    // Modal Management
    const modal = document.getElementById('game-modal');
    const modalTitle = document.getElementById('modal-title');
    const gameContainer = document.getElementById('game-container');
    const closeBtn = document.querySelector('.close-btn');
    const startBtn = document.getElementById('start-game');
    const restartBtn = document.getElementById('restart-game');
    let currentGame = null;

    // Game Cards Click Handlers
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const gameType = card.dataset.game;
            modalTitle.textContent = card.querySelector('h3').textContent;
            loadGame(gameType);
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        if (currentGame) {
            currentGame.destroy();
        }
    });

    // Game Logic
    class SnakeGame {
        constructor(container) {
            this.container = container;
            this.canvas = document.createElement('canvas');
            this.canvas.width = 400;
            this.canvas.height = 400;
            this.container.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            this.gridSize = 20;
            this.snake = [{x: 10, y: 10}];
            this.direction = 'right';
            this.food = this.generateFood();
            this.score = 0;
            this.gameLoop = null;
            this.setupControls();
        }

        generateFood() {
            return {
                x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
                y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
            };
        }

        setupControls() {
            document.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowUp': this.direction = 'up'; break;
                    case 'ArrowDown': this.direction = 'down'; break;
                    case 'ArrowLeft': this.direction = 'left'; break;
                    case 'ArrowRight': this.direction = 'right'; break;
                }
            });
        }

        start() {
            this.gameLoop = setInterval(() => this.update(), 100);
        }

        update() {
            const head = {...this.snake[0]};
            
            switch(this.direction) {
                case 'up': head.y--; break;
                case 'down': head.y++; break;
                case 'left': head.x--; break;
                case 'right': head.x++; break;
            }

            if (head.x === this.food.x && head.y === this.food.y) {
                this.score += 10;
                this.food = this.generateFood();
            } else {
                this.snake.pop();
            }

            this.snake.unshift(head);
            this.draw();

            // Check collision
            if (this.checkCollision()) {
                this.gameOver();
            }
        }

        checkCollision() {
            const head = this.snake[0];
            return (
                head.x < 0 || 
                head.x >= this.canvas.width / this.gridSize ||
                head.y < 0 || 
                head.y >= this.canvas.height / this.gridSize ||
                this.snake.slice(1).some(segment => 
                    segment.x === head.x && segment.y === head.y
                )
            );
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw snake
            this.ctx.fillStyle = '#6c5ce7';
            this.snake.forEach(segment => {
                this.ctx.fillRect(
                    segment.x * this.gridSize,
                    segment.y * this.gridSize,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
            });

            // Draw food
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.fillRect(
                this.food.x * this.gridSize,
                this.food.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );

            // Draw score
            this.ctx.fillStyle = '#2d3436';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        }

        gameOver() {
            clearInterval(this.gameLoop);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2);
        }

        destroy() {
            clearInterval(this.gameLoop);
            this.container.removeChild(this.canvas);
        }

        restart() {
            clearInterval(this.gameLoop);
            this.snake = [{x: 10, y: 10}];
            this.direction = 'right';
            this.food = this.generateFood();
            this.score = 0;
            this.start();
        }
    }

    function loadGame(gameType) {
        gameContainer.innerHTML = '';
        if (currentGame) {
            currentGame.destroy();
        }

        switch(gameType) {
            case 'snake':
                currentGame = new SnakeGame(gameContainer);
                break;
            // Add other game implementations here
            default:
                gameContainer.innerHTML = '<p>Game coming soon!</p>';
                return;
        }

        startBtn.onclick = () => currentGame.start();
        restartBtn.onclick = () => currentGame.restart();
    }

    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            if (currentGame) {
                currentGame.destroy();
            }
        }
    };
});
