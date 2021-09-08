console.log('objects.js');

class Block {
    constructor(view, color = false) {
        this.view = view;
        this.color = 'rgb(127.5, 127.5, 127.5)';
        if (color) this.color = color;
        this.x = 0;
        this.y = 0;
        this.width = this.view.clientWidth/22;
        this.height = this.view.clientHeight/21;
        this.border = this.width/3;
        this.spin = 0;
    }
    render(
        ctx,
        hollow = false,
        shadow = true
    ) {
        let c = this.color;
        let x = this.x;
        let y = this.y;
        let w = this.width;
        let h = this.height;
        let b = this.border/3;
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h);
        if (b <= 0) b = 0;
        if (b < 0.333) {
            if (hollow) {
                ctx.clearRect(x+3*b,y+3*b,w-6*b,h-6*b);
                return;
            }
            if (shadow) {
                ctx.fillStyle = 'rgba(0,0,0,0.125)';
                ctx.fillRect(x+3*b, y+3*b, w-6*b, h-6*b);
            }
            return;
        }
        if (b > w/6) b = w/6;
        let s,sr;
        s = this.spin % 4;
        sr = s * 90;
        let wr,hr;
        let g = 0;
        let i = 0;
        let f = false;
        ctx.save();
        ctx.translate(x+(w/2), y+(h/2));
        ctx.rotate((Math.PI/180) * sr);
        while (i < 4){
            g = Math.floor(255 / 3 * i);
            ctx.fillStyle = 'rgba(' + g + ', ' + g + ', ' + g + ',0.5)';
            ctx.rotate((Math.PI/180)*90);
            if (w !== h) {
                if (isEven(i)) {
                    if (isEven(s)) {
                        wr = h;
                        hr = w;
                    } else {
                        wr = w;
                        hr = h;
                    }
                } else {
                    if (isEven(s)) {
                        wr = w;
                        hr = h;
                    } else {
                        wr = h;
                        hr = w;
                    }
                }
            } else {
                wr = h;
                hr = w;
            }
            ctx.beginPath();
            if (i < 4 && !f) {
                ctx.moveTo((wr/2)-b,(hr/2)-b);
                ctx.lineTo((wr/2),(hr/2));
                ctx.lineTo((wr/2),-(hr/2));
                ctx.lineTo((wr/2)-b,-(hr/2)+b);
            } else if (i < 4) {
                ctx.moveTo((wr/2)-(3*b),(hr/2)-(3*b));
                ctx.lineTo((wr/2)-(2*b),(hr/2)-(2*b));
                ctx.lineTo((wr/2)-(2*b),-(hr/2)+(2*b));
                ctx.lineTo((wr/2)-(3*b),-(hr/2)+(3*b));
            }
            ctx.fill();
            i++;
            if (i === 4 && !f) {
                ctx.restore();
                ctx.save();
                ctx.translate(x+(w/2), y+(h/2));
                ctx.rotate((Math.PI/180) * (180 + sr));
                f = true;
                i = 0;
            }
        }
        ctx.restore();
        if (hollow) {
            ctx.clearRect(x+3*b,y+3*b,w-6*b,h-6*b);
        } else {
            ctx.fillStyle = c;
            ctx.fillRect(x+3*b, y+3*b, w-6*b, h-6*b);
            if (shadow) {
                ctx.fillStyle = 'rgba(0,0,0,0.125)';
                ctx.fillRect(x+3*b, y+3*b, w-6*b, h-6*b);
            }
        }
    }
    move(
        ctx,
        x = 0,
        y = 0
    ){
        ctx.clearRect(this.x,this.y, this.width, this.height);
        this.x += x;
        this.y += y;
        this.render(ctx);
    }
    collisionDetector(game) {
        // console.log(this.view.constructor);

        return this.y + this.height >= game.game.height;


        /*for (let block of game.blocks) {
        }*/
        // console.log(game.blocks);
    }
}

class Game {
    constructor(view) {
        this.view = view;
        this.level = 3;
        this.sPosX = 9;
        this.sPosY = -3;
        this.color1 = 'rgb(127.5, 127.5, 127.5)';
        this.color2 = 'rgb(255, 255, 255)';
        this.background = document.createElement('canvas');
        this.background.id = 'background-layer';
        this.backgroundCtx = this.background.getContext('2d');
        this.ui = document.createElement('canvas');
        this.ui.id = 'ui-layer';
        this.uiCtx = this.ui.getContext('2d');
        this.game = document.createElement('canvas');
        this.game.id = 'game-layer';
        this.gameCtx = this.game.getContext('2d');
        this.blocks = [];
        this.current = 'game.start()';
        this.nexts = [];
    }
    setup() {
        let w = this.view.clientWidth;
        let h = this.view.clientHeight;
        this.background.width = w;
        this.background.height = h;
        this.view.appendChild(this.background);
        this.ui.width = w;
        this.ui.height = h;
        this.view.appendChild(this.ui);
        this.game.width = w;
        this.game.height = h;
        this.view.appendChild(this.game);
        let block = new Block(this.view);
        block.width = w / 22;
        block.height = h / 21;
        let c;
        for (let i = 0; i < 21; i++) {
            for (let j = 0; j< 24; j++) {
                if (j > 5 && j < 16) c = this.color1;
                else c = this.color2;
                block.color = c;
                block.x = j*block.width;
                block.y = i*block.height;
                block.render(this.backgroundCtx);
            }
        }
        let blocksWidth = w / 22;
        let blocksHeight = h / 21;
        let frame = new Block(this.view);
        frame.color = this.color1;
        frame.x = 0;
        frame.y = 0;
        frame.width = blocksWidth * 6;
        frame.height = blocksHeight * 6;
        frame.render(this.uiCtx, true);
        frame.y = frame.height;
        frame.height = h - frame.height;
        frame.render(this.uiCtx);
        frame.x = w - blocksWidth * 6;
        frame.y = 0;
        frame.height = h - blocksHeight * 6;
        frame.render(this.uiCtx, true);
        frame.y = frame.height;
        frame.height = blocksHeight * 6;
        frame.render(this.uiCtx);
    }
    update() {
        let tetrominos = [
            new I(this.view),
            new T(this.view),
            new O(this.view),
            new L(this.view),
            new J(this.view),
            new Z(this.view),
            new S(this.view),
        ];
        this.nexts[0] = tetrominos[this.nexts[0].id];
        this.current = this.nexts[0];
        this.current.posX = this.sPosX;
        this.current.posY = this.sPosY;
        this.current.build();
        this.current.render(this.gameCtx);

        this.nexts.shift();
        this.nexts.push(randomTetromino(this.view));

        let w = this.view.clientWidth;
        let h = this.view.clientHeight;
        let bw = w / 22;
        let bh = h / 21;

        let o = 1;
        for (let next of this.nexts) {
            next.posX = 17;
            next.posY = o;
            next.build();
            this.uiCtx.clearRect(
                next.posX * 30,
                next.posY * 30, // TODO! understand
                bw * 4,
                bh * 4
            )
            o += 4;
            next.render(this.uiCtx);
        }
    }
    start() {
        for (let i = 0 ; i < 3; i ++) {
            this.nexts.push(randomTetromino(this.view));
        }
        let o = 1;
        for (let next of this.nexts) {
            next.posX = 17;
            next.posY = o;
            next.build();
            next.render(this.uiCtx);
            o += 4;
        }
        this.current = randomTetromino(this.view);
        this.current.posX = this.sPosX;
        this.current.posY = this.sPosY;
        this.current.build();
        this.current.render(this.gameCtx);
    }
}

class Tetromino {
    constructor(view) {
        this.view = view;
        this.color = '';
        this.posX = 0;
        this.posY = 0;
        this.spin = 0;
        this.blocks = [];
        this.patterns = [
            [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
            ]
        ];
    }
    build() {
        let x = this.posX;
        let y = this.posY;
        for (let line of this.patterns[this.spin]) {
            for (let block of line) {
                if (block !== 0) {
                    block = new Block(this.view, this.color);
                    block.x = x * block.width;
                    block.y = y * block.height;
                    this.blocks.push(block);
                }
                x++;
            }
            x = this.posX;
            y++;
        }
    }
    render(ctx) {
        for (let block of this.blocks) {
            block.render(ctx);
        }
    }
    move(
        ctx,
        x = 0,
        y = 0
    ){
        for (let block of this.blocks) {
            ctx.clearRect(block.x,block.y, block.width, block.height);
            block.x += x;
            block.y += y;
        }
        this.posX += x;
        this.posY += y;
        this.render(ctx);
    }
    fall(game){
        let detection = this.collisionDetector(game);
        if (!detection) {
            game.current.move(game.gameCtx, 0, game.level);
            return true;
        } else return false;
    }
    collisionDetector(game){
        for (let block of this.blocks) {
            if(block.collisionDetector(game)) {
                return true;
            }
        }
    }
}

class I extends Tetromino {
    constructor(view) {
        super(view);
        this.view = view;
        this.id = 0;
        this.color = 'lightblue';
        this.patterns = [
            [
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0]
            ],[
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [1,1,1,1]
            ],[
                [0,0,1,0],
                [0,0,1,0],
                [0,0,1,0],
                [0,0,1,0]
            ]
        ];
    }
}
class O extends Tetromino {
    constructor(view) {
        super(view);
        this.view = view;
        this.id = 1;
        this.color = 'yellow';
        this.patterns = [
            [
                [0,0,0,0],
                [0,1,1,0],
                [0,1,1,0],
                [0,0,0,0]
            ]
        ];
    }
}
class T extends Tetromino {
    constructor(view) {
        super(view);
        this.view = view;
        this.id = 2;
        this.color = 'purple';
        this.patterns = [
            [
                [0,0,0,0],
                [0,0,0,0],
                [1,1,1,0],
                [0,1,0,0]
            ]
        ];
    }
}
class L extends Tetromino {
    constructor(view) {
        super(view);
        this.view = view;
        this.id = 3;
        this.color = 'orange';
        this.patterns = [
            [
                [0,0,0,0],
                [0,0,0,0],
                [1,1,1,0],
                [1,0,0,0]
            ]
        ];
    }
}
class J extends Tetromino {
    constructor(view) {
        super(view);
        this.view = view;
        this.id = 4;
        this.color = 'blue';
        this.patterns = [
            [
                [0,0,0,0],
                [0,0,0,0],
                [1,1,1,0],
                [0,0,1,0]
            ]
        ];
    }
}
class Z extends Tetromino {
    constructor(view) {
        super(view);
        this.view = view;
        this.id = 5;
        this.color = 'red';
        this.patterns = [
            [
                [0,0,0,0],
                [0,0,0,0],
                [1,1,0,0],
                [0,1,1,0]
            ]
        ];
    }
}
class S extends Tetromino {
    constructor(view) {
        super(view);
        this.view = view;
        this.id = 6;
        this.color = 'green';
        this.patterns = [
            [
                [0,0,0,0],
                [0,0,0,0],
                [0,1,1,0],
                [1,1,0,0]
            ]
        ];
    }
}