const gameView = document.getElementById('game-view');

let game = new Game(gameView);
game.init();

let startPanel = document.getElementById('start-panel');
let keyBinding = document.getElementById('key-binding');
let gameOverPanel = document.getElementById('game-over-panel');
let stats = gameOverPanel.querySelector('p');
let startButton = document.getElementById('start-button');

let time = 150;
let checkTime = 3;
let l, animeBlock;

if (game.init) {
    game.start();
    animeBlock = new Block(game.view);
    animeBlock.width = game.width;
    animeBlock.height = game.height;
    animeBlock.border = game.width / 6;
    animeBlock.render(game.gameCtx);
    startButton.addEventListener('click', start);
}

function start() {
    startPanel.style.display = 'none';
    keyBinding.style.display = 'none';
    gameOverPanel.style.display = 'block';
    stats.style.display = 'block';
    requestAnimationFrame(startAnime);
    l = setInterval(loop, time);
}
function restart() {
    gameView.innerHTML = '';
    game = new Game(gameView);
    game.init(true);

    startPanel = document.getElementById('start-panel');
    gameOverPanel = document.getElementById('game-over-panel');
    stats = gameOverPanel.querySelector('p');
    startButton = document.getElementById('start-button');

    game.start();

    startPanel.style.display = 'none';
    requestAnimationFrame(startAnime);
    l = setInterval(loop, time);
}

function loop() {
    game.current.fall(game);
    if (!game.current.fall(game)) {
        clearInterval(l);
        requestAnimationFrame(closeAnime);
    }
    if (game.current.fall(game) === 'bottom') {
        clearInterval(l);
        let t = game.current.temporize(game);
        if (!t) {
            game.update();
        }
        else {
            if (checkTime > 0) {
                game.current.fall(game);
                checkTime--;
            } else {
                game.update();
            }
        }
        setTimeout(function () {
            l = setInterval(loop, time);
        }, time / 3)
    } else checkTime = 3;
}
function startAnime(time) {
    if (animeBlock.border < 0) return;
    animeBlock.border -= 3.6;
    animeBlock.render(game.gameCtx, true);
    requestAnimationFrame(startAnime);
}
function closeAnime(time) {
    if (animeBlock.border >= game.width / 6) {
        animeBlock.render(game.gameCtx);
        startPanel.style.display = 'block';
        stats.innerHTML = 'Score &nbsp;&nbsp; : &nbsp;&nbsp; ' + game.score;
        gameOverPanel.style.display = 'block';
        stats.style.display = 'block';
        if (startButton.textContent === 'START') {
            startButton.removeEventListener('click', start);
            startButton.addEventListener('click', restart);
        }
        startButton.textContent = 'RESTART';
        return;
    }
    animeBlock.border += 3.6;
    animeBlock.render(game.gameCtx, true);
    requestAnimationFrame(closeAnime);
}
