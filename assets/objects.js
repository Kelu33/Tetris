console.log('objects.js');

class Game {
    constructor(view) {
        this.view = view;
        this.width = this.view.clientWidth;
        this.height = this.view.clientHeight;
        this.blockWidth = this.width / 21;
        this.blockHeight = this.height / 21;
        this.color1 = 'rgb(127.5, 127.5, 127.5)';
        this.color2 = 'rgb(255, 255, 255)';

        this.startPosX = this.blockWidth * 8.5;
        this.startPosY = - this.blockHeight * 3;

        this.nextPosX = this.width - this.blockWidth * 5.25;
        this.nextPosY = [
            this.blockHeight + this.blockHeight / 4,
            this.blockHeight * 6 + this.blockHeight / 4,
            this.blockHeight * 11 + this.blockHeight / 4
        ];

        this.holdPosX = this.blockWidth / 4;
        this.holdPosY = this.blockHeight + this.blockHeight / 4;

        this.level = 1;
        this.blocks = [];
    }
    init() {
        this.game = document.createElement('canvas');
        if (!this.game.getContext('2d')) {
            let error = document.createElement('div');
            error.className = 'canvas-error';
            error.textContent = 'no canvas support';
            this.view.appendChild(error);
            console.log('no canvas support');
            return false;
        }
        this.gameCtx = this.game.getContext('2d');
        this.game.id = 'game-layer';
        this.ui = document.createElement('canvas');
        this.uiCtx = this.ui.getContext('2d');
        this.ui.id = 'ui-layer';
        this.background = document.createElement('canvas');
        this.backgroundCtx = this.background.getContext('2d');
        this.background.id = 'background-layer';
        let elements = [
            this.game,
            this.ui,
            this.background
        ];
        let z = 3;
        for (let element of elements) {
            element.style.position = 'absolute';
            element.width = this.width;
            element.height = this.height;
            element.style.zIndex = z.toString();
            this.view.appendChild(element);
            z--;
        }
        this.build();
    }
    build() {
        let block = new Block(this.view);
        let x = this.blockWidth / 2;
        let y = 0;
        for (let i = 0; i < 21; i++) {
            for (let j = 0; j < 20; j++) {
                if (j >= 5 && j < 15) {
                    block.color = this.color1;
                    block.x = x;
                    block.y = y;
                    block.render(this.backgroundCtx);
                } else if (j < 5 && i < 6) {
                    block.color = this.color2;
                    block.x = x - this.blockWidth / 4;
                    block.y = y + this.blockHeight / 4;
                    block.render(this.backgroundCtx);
                } else if (j >= 15 && i < 16) {
                    block.color = this.color2;
                    block.x = x + this.blockWidth / 4;
                    block.y = y + this.blockHeight / 4;
                    block.render(this.backgroundCtx);
                }
                x += this.blockWidth;
            }
            x =  this.blockWidth / 2;
            y += this.blockHeight;
        }
        let frame = new Block(this.view);
        frame.color = this.color1;
        frame.x = 0;
        frame.y = 0;
        frame.width = (this.blockWidth * 6) - this.blockWidth / 2;
        frame.height = (this.blockHeight * 6) + this.blockHeight / 2;
        frame.render(this.uiCtx, true);

        frame.y = frame.height;
        frame.height = this.height - frame.height;
        frame.render(this.uiCtx);

        frame.x = (this.width - this.blockWidth * 6) + this.blockWidth / 2;
        frame.y = 0;
        frame.height = (this.height - this.blockHeight * 5) + this.blockHeight / 2;
        frame.render(this.uiCtx, true);

        frame.y = frame.height;
        frame.height = (this.blockHeight * 5) - this.blockHeight / 2;
        frame.render(this.uiCtx);
    }
    randomTetromino() {
        let tetrominos = [
            new I(this.view),
            new O(this.view),
            new T(this.view),
            new L(this.view),
            new J(this.view),
            new Z(this.view),
            new S(this.view)
        ];
        let r = dice(tetrominos.length);
        return tetrominos[r];
    }
    start() {
        this.current = this.randomTetromino();
        this.current.posX = this.startPosX;
        this.current.posY = this.startPosY;
        this.current.build(this);
        this.current.render(this.gameCtx);
        this.nexts = [];
        for (let i = 0; i < 3; i++) {
            let next = this.randomTetromino();
            next.posX = this.nextPosX;
            next.posY = this.nextPosY[i];
            next.build(this);
            next.render(this.uiCtx);
            this.nexts.push(next);
        }
        this.addControls(this);
    }
    addControls(game) {
        window.addEventListener('keydown', function (e){ // TODO! debug
            if (e.key === 'ArrowLeft') {
                let f = false;
                for (let block of game.current.blocks) {
                    if (block.isCollided(game) === 'leftWall') f = true;
                }
                if (!f) game.current.move(game.gameCtx, - game.blockWidth);
            }
            if (e.key === 'ArrowRight') {
                let f = false;
                for (let block of game.current.blocks) {
                    if (block.isCollided(game) === 'rightWall') f = true;
                }
                if (!f) game.current.move(game.gameCtx, + game.blockWidth);
            }
        });
    }
    update() {
        for (let block of this.current.blocks) {
            block.render(this.backgroundCtx);
            this.blocks.push(block);
        }
        let tetrominos = [
            new I(this.view),
            new O(this.view),
            new T(this.view),
            new L(this.view),
            new J(this.view),
            new Z(this.view),
            new S(this.view),
        ];
        this.nexts[0] = tetrominos[this.nexts[0].id];
        this.current = this.nexts[0];
        this.current.posX = this.startPosX;
        this.current.posY = this.startPosY;
        this.current.build(this);
        this.current.render(this.gameCtx);
        this.nexts.shift();
        this.nexts.push(this.randomTetromino());
        let i = 0;
        for (let next of this.nexts) {
            next.posX = this.nextPosX;
            next.posY = this.nextPosY[i];
            next.build(this);
            this.uiCtx.clearRect(
                next.posX,
                next.posY,
                this.blockWidth * 5 - this.blockWidth / 4,
                this.blockHeight * 5
            );
            next.render(this.uiCtx);
            i++;
        }
        for (let block of this.blocks) {
            block.render(this.backgroundCtx);
        }
    }
}

class Block {
    constructor(view, color = false) {
        this.view = view;
        this.color = 'rgb(127.5, 127.5, 127.5)';
        if (color) this.color = color;
        this.x = 0;
        this.y = 0;
        this.width = this.view.clientWidth/21;
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
    isCollided(game) {
        let detection = false;
        for (let block of game.blocks) {
            if (
                this.y + this.height >= block.y &&
                this.x  === block.x + block.width  // TODO! debug
            ) detection = 'leftWall';
            if (
                this.y + this.height >= block.y &&
                this.x + this.width  === block.x
            ) detection = 'rightWall';
            if (
                (
                    this.y + this.height >= block.y &&
                    this.x < block.x + block.width &&
                    this.x >= block.x
                ) || (
                    this.y + this.height >= block.y &&
                    this.x + this.width > block.x &&
                    this.x <= block.x
                )
            ) {
                if (this.y <= 0) return 'gameOver';
                return true;
            }
        }
        if (this.x <= game.blockWidth * 6) return 'leftWall';
        else if (detection) return detection;
        else if (this.x + this.width >= game.blockWidth * 15) return 'rightWall';
        else return false;
    }
}

class Tetromino {
    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.color = 'rgb(127.5, 127.5, 127.5)';
        this.blocks = [];
        this.spin = 0;
        this.patterns = [
            [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]

            ]
        ];
    }
    build(game) {
        let pattern = this.patterns[this.spin % this.patterns.length];
        let x = this.posX;
        let y = this.posY;
        for (let line of pattern) {
            for (let digit of line) {
                if (digit !== 0) {
                    let block = digit;
                    block = new Block(game.view, this.color);
                    block.x = x;
                    block.y = y;
                    this.blocks.push(block);
                }
                x += game.blockWidth;
            }
            x = this.posX;
            y += game.blockHeight;
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
    ) {
        for (let block of this.blocks) {
            ctx.clearRect(block.x,block.y, block.width, block.height);
            block.x += x;
            block.y += y;
        }
        if (x !== 0) this.posX += x / this.blocks[0].width;
        if (y !== 0) this.posY += y / this.blocks[0].height;
        this.render(ctx);
    }
    fall(game) {
        for (let block of this.blocks) {
            if (block.y + block.height >= game.height) return 'bottom';
            if (block.isCollided(game) === 'gameOver') return false;
            if (
                block.isCollided(game) &&
                block.isCollided(game) !== 'leftWall' &&
                block.isCollided(game) !== 'rightWall'
            ) return 'collided';
        }
        this.move(game.gameCtx, 0, game.level);
        return true;
    }
}

class I extends Tetromino {
    constructor() {
        super();
        this.id = 0;
        this.color = 'lightblue';
        this.patterns = [
            [
                [0,0,1,0],
                [0,0,1,0],
                [0,0,1,0],
                [0,0,1,0]

            ],
            [
                [0,0,0,0],
                [0,0,0,0],
                [1,1,1,1],
                [0,0,0,0]

            ]
        ];
    }
}
class O extends Tetromino {
    constructor() {
        super();
        this.id = 1;
        this.color = 'gold';
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
    constructor() {
        super();
        this.id = 2;
        this.color = 'purple';
        this.patterns = [
            [
                [0,0,0,0],
                [0,1,1,1],
                [0,0,1,0],
                [0,0,0,0]
            ],
            [
                [0,0,1,0],
                [0,1,1,0],
                [0,0,1,0],
                [0,0,0,0]
            ],
            [
                [0,0,1,0],
                [0,1,1,1],
                [0,0,0,0],
                [0,0,0,0]
            ],
            [
                [0,0,1,0],
                [0,0,1,1],
                [0,0,1,0],
                [0,0,0,0]
            ]
        ];
    }
}
class L extends Tetromino {
    constructor() {
        super();
        this.id = 3;
        this.color = 'orange';
        this.patterns = [
            [
                [0,0,1,0],
                [0,0,1,0],
                [0,0,1,1],
                [0,0,0,0]

            ],
            [
                [0,0,0,0],
                [0,0,0,1],
                [0,1,1,1],
                [0,0,0,0]

            ],
            [
                [0,0,1,1],
                [0,0,0,1],
                [0,0,0,1],
                [0,0,0,0]

            ],
            [
                [0,0,0,0],
                [0,1,1,1],
                [0,1,0,0],
                [0,0,0,0]

            ]
        ];
    }
}
class J extends Tetromino {
    constructor() {
        super();
        this.id = 4;
        this.color = 'blue';
        this.patterns = [
            [
                [0,0,1,0],
                [0,0,1,0],
                [0,1,1,0],
                [0,0,0,0]

            ],
            [
                [0,0,0,0],
                [0,1,0,0],
                [0,1,1,1],
                [0,0,0,0]

            ],
            [
                [0,1,1,0],
                [0,1,0,0],
                [0,1,0,0],
                [0,0,0,0]

            ],
            [
                [0,0,0,0],
                [0,1,1,1],
                [0,0,0,1],
                [0,0,0,0]

            ]
        ];
    }
}
class Z extends Tetromino {
    constructor() {
        super();
        this.id = 5;
        this.color = 'red';
        this.patterns = [
            [
                [0,0,0,0],
                [0,1,1,0],
                [0,0,1,1],
                [0,0,0,0]

            ],
            [
                [0,0,0,1],
                [0,0,1,1],
                [0,0,1,0],
                [0,0,0,0]

            ]
        ];
    }
}
class S extends Tetromino {
    constructor() {
        super();
        this.id = 6;
        this.color = 'green';
        this.patterns = [
            [
                [0,0,0,0],
                [0,0,1,1],
                [0,1,1,0],
                [0,0,0,0]

            ],
            [
                [0,1,0,0],
                [0,1,1,0],
                [0,0,1,0],
                [0,0,0,0]

            ]
        ];
    }
}