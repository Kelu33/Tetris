console.log('app.js');

const gameView = document.getElementById('game-view');

let game = new Game(gameView);
game.init();
game.start();

function loop(time) {
    if (
        game.current.fall(game) !== 'bottom' &&
        game.current.fall(game) !== 'collided'
    ) {
        game.current.fall(game);
    } else {
        game.update();
    }
    if (!game.current.fall(game)) {
        console.log('gameOver'); // TODO! f restart()
        return;
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

let hold = new T();
hold.posX = game.holdPosX;
hold.posY = game.holdPosY;
hold.build(game);
hold.render(game.gameCtx);