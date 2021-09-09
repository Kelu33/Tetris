console.log('app.js');

const tetris = document.getElementById('tetris');

let game = new Game(tetris);
game.setup();
game.start();

/*for (let block of game.current.blocks) {
    console.log(block.x, block.y);
}*/
console.log(game.current.posX, game.current.posY);
console.log('--------------------------');

/*let test = new I(tetris);
test.posX = 9;
test.posY = 15;
test.build();
test.render(game.gameCtx);
test.spin90(game);*/

/*function loop(time) {
    if (game.current.fall(game)) {
        if (game.current.fall(game) !== 'gameOver') {
            game.current.fall(game);
        } else {
            console.log('gameOver');
            return;
        }
    } else {
        // console.log(game.current.fall(game));
        game.update();
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);*/



/*let spX = 9;
let spY = -3;

let tetromino = game.current;
tetromino.posX = spX;
tetromino.posY = spY;
tetromino.build();
tetromino.render(game.gameCtx);

let gw = game.view.clientWidth/22;
let sp = gw * 9;
tetromino.x = sp;


game.level = 3;
let v = game.level;
let f = false;
function loop(time) {
    if (!tetromino.collisionDetector()) {
        tetromino.move(game.gameCtx, 0, v);
    } else {
        game.update();
        return;
    }

    /!*tetromino.spin = 0;
        tetromino.y = tetromino.y - v;
        game.blocks.push(tetromino);
        tetromino = new Block(tetris);
        tetromino.x = sp;
        for (let block of game.blocks) {
            block.render(game.backgroundCtx);
        }*!/
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);*/

/*setInterval(function () {
    tetromino.spin ++;
}, 100);*/

/*let color;
let r,g,b;
setInterval(function () {
    r = dice(256);
    g = dice(256);
    b = dice(256);
    color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    tetromino.color = color;
}, 400);*/

/*let wl = gw * 6;
let wr = game.view.clientWidth - gw * 6;
window.addEventListener('keydown', function (e) {
    console.log(e.key);
    if (
        e.key === 'ArrowRight' &&
        tetromino.x + tetromino.width < wr
    ) tetromino.move(game.gameCtx, tetromino.width);

    if (
        e.key === 'ArrowLeft' &&
        tetromino.x > wl
    ) tetromino.move(game.gameCtx, -tetromino.width);
})*/


