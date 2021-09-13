console.log('app.js');

const gameView = document.getElementById('game-view');

let game = new Game(gameView);
game.level = 5;
game.init();
game.start();

let l = setInterval(loop, 350);

function loop() {
    game.current.fall(game);
    if (!game.current.fall(game)) {
        console.log('gameOver'); // TODO! f restart()
        clearInterval(l);
    }
    if (game.current.fall(game) === 'bottom') {
        clearInterval(l);
        setTimeout(function () {
            game.update();
            l = setInterval(loop, 350);
        }, 150);
    }
}

/*let hold = new T();
hold.posX = game.holdPosX;
hold.posY = game.holdPosY;
hold.build(game);
hold.render(game.gameCtx);*/
