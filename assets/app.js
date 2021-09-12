console.log('app.js');

const gameView = document.getElementById('game-view');

let game = new Game(gameView);
game.level = 1;
game.init();
game.start();

let l = setInterval(loop, 200);

function checker() {

    let line;
    for (let block of game.current.blocks) {
        line = Math.floor(Math.ceil(block.y) / game.blockHeight);
        if (line >= 0) this.lines[line].push(block);

        block.y -= game.level;
    }

    console.log(game.checkForLines());

    game.current.fall(game)  // TODO! f check for lines
}

function loop() {
    game.current.fall(game);
    if (!game.current.fall(game)) {
        console.log('gameOver'); // TODO! f restart()
        clearInterval(l);
    }
    if (game.current.fall(game) === 'bottom') {
        clearInterval(l);
        let c = setInterval(checker, 200);
        setTimeout(function (){
            clearInterval(c);
            l = setInterval(loop, 200);
            if(game.current.fall(game) === 'bottom') game.update();
        }, 350);
    }
}

/*let hold = new T();
hold.posX = game.holdPosX;
hold.posY = game.holdPosY;
hold.build(game);
hold.render(game.gameCtx);*/
