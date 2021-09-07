console.log('app.js');
// if ( document.querySelector('canvas').getContext ) {}
const backgroundCtx = document
    .getElementById('background-layer')
    .getContext('2d');
const gameCtx = document
    .getElementById('game-layer')
    .getContext('2d');
const uiCtx = document
    .getElementById('ui-layer')
    .getContext('2d');

let game = new Game();
game.setup(backgroundCtx, uiCtx);

let tetromino = new Block();
tetromino.x = 200;
let color;
let r,g,b;

setInterval(function () {
    tetromino.spin ++;
}, 100);
setInterval(function () {
    r = dice(256);
    g = dice(256);
    b = dice(256);
    color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    tetromino.color = color;
}, 400);

window.addEventListener('keydown', function (e) {
    console.log(e.key);
    if (
        e.key === 'ArrowRight' &&
        tetromino.x < 300
    ) tetromino.move(gameCtx, tetromino.width);

    if (
        e.key === 'ArrowLeft' &&
        tetromino.x > 120
    ) tetromino.move(gameCtx, -tetromino.width);
})

let v = game.level;
function loop(time) {
    if (tetromino.y <= gameCtx.canvas.height - tetromino.height) {
        tetromino.move(gameCtx, 0, v);
    } else {
        tetromino.spin = 0;
        tetromino.y = tetromino.y - v;
        game.blocks.push(tetromino);
        tetromino = new Block();
        tetromino.x = 200;
        for (let block of game.blocks) {
            block.render(backgroundCtx);
        }
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

