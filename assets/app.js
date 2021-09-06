console.log('app.js');
// if ( document.querySelector('canvas').getContext ) {}
/*const backgroundCtx = document
    .getElementById('background-layer')
    .getContext('2d');
const gameCtx = document
    .getElementById('game-layer')
    .getContext('2d');*/
const uiCtx = document
    .getElementById('ui-layer')
    .getContext('2d');

let block;
let color;
let r,g,b;
function loop(time) {
    for (let i = 0; i < 21; i++) {
        for (let j = 0; j < 16; j++) {
            r = i*j;
            g = r;
            b = r;
            // r = dice(255);
            // g = dice(255);
            // b = dice(255);
            color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
            block = new Block(color);
            block.x = j*20;
            block.y = i*20;
            block.render(uiCtx);
        }
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
