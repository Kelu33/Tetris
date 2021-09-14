console.log('app.js');

const gameView = document.getElementById('game-view');

let game = new Game(gameView);
game.level = 1;
game.init();
game.start();

let time = 150;
let l = setInterval(loop, time);
let checkTime = 3;

function loop() {
    game.current.fall(game);
    if (!game.current.fall(game)) {
        clearInterval(l);
        console.log('gameOver'); // TODO! f restart()
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

/*let hold = new T();
hold.posX = game.holdPosX;
hold.posY = game.holdPosY;
hold.build(game);
hold.render(game.gameCtx);*/
