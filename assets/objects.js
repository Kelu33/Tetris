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
        this.blocks = [
            [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]
        ];
        this.score = 0;
        this.combo = 0;
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

        this.uiCtx.fillStyle = this.color2;
        this.uiCtx.font = '24px sans-serif';
        this.uiCtx.fillText('score :', this.blockWidth, this.blockHeight * 14);
        this.uiCtx.fillText(this.score, this.blockWidth, this.blockHeight * 16);
        this.uiCtx.fillText('lvl', this.blockWidth * 2, this.blockHeight * 18);
        this.uiCtx.fillText(this.level, this.blockWidth * 2.5, this.blockHeight * 20);
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
        window.addEventListener('keydown', function (e){
            let d1 = [];
            // -------------------------------------------------------------
            // console.log(e.key);
            /*if (e.key === ' ') {
                game.update();
            }*/
            // -------------------------------------------------------------
            for (let block of game.current.blocks) {
                if (block.isCollided(game, false)) {
                    d1.push(block.isCollided(game, false))
                }
            }
            if (e.key === 'ArrowLeft') {
                if (
                    !d1.includes('leftWall') &&
                    !d1.includes('both')
                ) game.current.move(game.gameCtx, - game.blockWidth);
            }
            if (e.key === 'ArrowRight') {
                if (
                    !d1.includes('rightWall') &&
                    !d1.includes('both')
                ) game.current.move(game.gameCtx,game.blockWidth);
            }
            let d2;
            for (let block of game.current.blocks) {
                if (block.isCollided(game)) {
                    d2 = block.isCollided(game);
                }
            }
            if (e.key === 'ArrowUp') {
                while (d2 !== 'bottom') {
                    for (let block of game.current.blocks) {
                        if (block.isCollided(game)) {
                            d2 = block.isCollided(game);
                        }
                    }
                    game.current.move(game.gameCtx,0 , 1);
                }
                game.current.move(game.gameCtx,0 , -1);
            }

            if (e.key === 'ArrowDown') {
                if (d2 !== 'bottom') {
                    game.current.move(game.gameCtx,0 , game.blockHeight / 5);
                }
            }

            if (e.key === 'Control') {
                game.current.spin90(game);
            }
        });
    }
    update() {
        let line;
        for (let block of this.current.blocks) {
            line = Math.floor(Math.ceil(block.y) / this.blockHeight) + 3;
            block.render(this.backgroundCtx);
            this.blocks[line].push(block);
        }

        let score = [];
        for (let line of this.blocks) {
            if (line.length >= 10) {
                score.push(100);
            }
        }
        if (score.length > 0) this.combo++;
        else this.combo = 0;
        for (let line of score) {
            this.score += line * score.length * this.combo;
        }
        if (this.level < 9) {
            this.level = Math.floor((this.score / 2000) + 1);
        }

        if (this.level === 3 || this.level === 4) {
            this.color1 = '#455734';
        }
        if (this.level === 5 || this.level === 6) {
            this.color1 = '#4f3f2a';
        }
        if (this.level === 7 || this.level === 8) {
            this.color1 = '#001F52';
        }
        if (this.level === 9) {
            this.color1 = '#000';
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
        this.gameCtx.clearRect(0,0,this.width, this.height);
        this.current.render(this.gameCtx);
        this.nexts.shift();
        this.nexts.push(this.randomTetromino());

        this.build();

        // TODO! hold render

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

        for (let line of this.blocks) {
            if (line.length >= 10) {
                for (let block of line) {
                    line.splice(line.indexOf(block), 10);
                }
                this.blocks.splice(this.blocks.indexOf(line), 1);
                this.blocks.unshift([]);
            }
        }

        for (let line of this.blocks) {
            for (let block of line) {
                block.y = this.blocks.indexOf(line) * this.blockHeight - this.blockHeight * 3;
                block.render(this.backgroundCtx);
            }
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
    isCollided(game, bottom = true) {
        let detection = {
            'left' : false,
            'right': false
        };
        if (bottom) {
            if (this.y + this.height >= game.height) return 'bottom';
        } else {
            if (this.x <= game.blockWidth * 6) detection['left'] = true;
            if (this.x + this.width >= game.width - game.blockWidth * 6) detection['right'] = true;
        }
        for (let line of game.blocks) {
            for (let block of line) {
                if (bottom) {
                    if (
                        Math.floor(this.y + this.height) >= Math.floor(block.y) &&
                        Math.floor(this.y) <= Math.floor(block.y + block.height) &&
                        Math.floor(this.x) === Math.floor(block.x)
                    ) {
                        if (this.y < 0) return 'gameOver';
                        return 'bottom';
                    }
                } else {
                    if (
                        Math.floor(this.y + this.height) > Math.floor(block.y) &&
                        Math.floor(this.y) < Math.floor(block.y + block.height)
                    ) {
                        if (Math.floor(this.x) === Math.floor(block.x + block.width)) {
                            detection['left'] = block;
                        }
                        if (Math.floor(this.x + this.width) === Math.floor(block.x)) {
                            detection['right'] = block;
                        }
                    }
                }
            }
        }
        if (!bottom) {
            if (detection['left'] && detection['right']) return 'both';
            else if (detection['left']) return 'leftWall';
            else if (detection['right']) return 'rightWall';
            else return false;
        }
    }
}

class Tetromino {
    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.color = 'rgb(127.5, 127.5, 127.5)';
        this.blocks = [];
        this.spin = 0;
        this.id = -1;
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
        ctx.clearRect(0, 0, game.width, game.height);
        for (let block of this.blocks) {
            block.x += x;
            block.y += y;
        }
        if (x !== 0) this.posX += x / this.blocks[0].width;
        if (y !== 0) this.posY += y / this.blocks[0].height;
        this.render(ctx);
    }
    fall(game) {
        for (let block of this.blocks) {
            if (block.isCollided(game) === 'gameOver') return false;
            if (block.isCollided(game) === 'bottom') return 'bottom';
        }
        this.move(game.gameCtx, 0, game.level);
        return true;
    }
    temporize(game) {
        let d = [];
        for (let block of game.current.blocks) {
            if (block.isCollided(game, false)) {
                d.push(block.isCollided(game, false));
            }
        }
        if (
            d.includes('both') ||
            (
                d.includes('leftWall') &&
                d.includes('rightWall')
            )
        ) return false;
        else if (
            d.length === 0 ||
            d.includes('leftWall') ||
            d.includes('rightWall')
        ) {
            return true;
        }
    }
    spin90(game) {
        let bothD = [];
        for (let block of this.blocks) {
            bothD.push(block.isCollided(game, false));
        }
        if (
            bothD.includes('both') ||
            (
                bothD.includes('leftWall') &&
                bothD.includes('rightWall')
            )
        ) return false;

        game.gameCtx.clearRect(0, 0, game.width, game.height);
        if (
            this.id === 0 ||
            this.id === 1
        ) {
            this.posX = this.blocks[0].x - this.blocks[0].width;
            this.posY = this.blocks[0].y - this.blocks[0].height;
        } else if (this.id === 2) {
            if (isEven(this.spin)) {
                if (this.blocks[1].y < this.blocks[3].y) {
                    this.posX = this.blocks[2].x - this.blocks[2].width * 3;
                    this.posY = this.blocks[2].y - this.blocks[2].height;
                } else {
                    this.posX = this.blocks[3].x - this.blocks[3].width * 3;
                    this.posY = this.blocks[2].y - this.blocks[2].height;
                }
            } else {
                if (this.blocks[1].x < this.blocks[3].x) {
                    this.posX = this.blocks[1].x - this.blocks[1].width;
                    this.posY = this.blocks[1].y - this.blocks[1].height;
                } else {
                    this.posX = this.blocks[1].x - this.blocks[1].width * 2;
                    this.posY = this.blocks[0].y;
                }
            }
        } else if (this.id === 3) {
            if (isEven(this.spin)) {
                if (this.blocks[0].x < this.blocks[1].x) {
                    this.posX = this.blocks[0].x - this.blocks[0].width * 2;
                    this.posY = this.blocks[0].y;
                } else {
                    this.posX = this.blocks[0].x - this.blocks[0].width;
                    this.posY = this.blocks[0].y;
                }
            } else {
                if (this.blocks[0].x < this.blocks[1].x) {
                    this.posX = this.blocks[0].x - this.blocks[0].width * 2;
                    this.posY = this.blocks[0].y - this.blocks[0].height;
                } else {
                    this.posX = this.blocks[0].x - this.blocks[0].width * 3;
                    this.posY = this.blocks[0].y - this.blocks[0].height;
                }
            }
        } else if (this.id === 4) {
            if (isEven(this.spin)) {
                if (this.blocks[0].x < this.blocks[1].x) {
                    this.posX = this.blocks[0].x - this.blocks[0].width;
                    this.posY = this.blocks[0].y;
                } else {
                    this.posX = this.blocks[0].x - this.blocks[0].width * 2;
                    this.posY = this.blocks[0].y;
                }
            } else {
                this.posX = this.blocks[0].x - this.blocks[0].width;
                this.posY = this.blocks[0].y - this.blocks[0].height;
            }
        } else if (this.id === 5) {
            if (isEven(this.spin)) {
                this.posX = this.blocks[0].x - this.blocks[0].width;
                this.posY = this.blocks[0].y - this.blocks[0].height;
            } else {
                this.posX = this.blocks[0].x - this.blocks[0].width * 3;
                this.posY = this.blocks[0].y;
            }
        } else if (this.id === 6) {
            if (isEven(this.spin)) {
                this.posX = this.blocks[0].x - this.blocks[0].width;
                this.posY = this.blocks[0].y - this.blocks[0].height;
            } else {
                this.posX = this.blocks[0].x - this.blocks[0].width * 2;
                this.posY = this.blocks[0].y;
            }
        }
        this.blocks = [];
        this.spin++;
        this.build(game);

        let d = {
            'left' : [],
            'right' : [],
            'bottom' : []
        };

        for (let block of this.blocks) {
            if (block.isCollided(game, false) === 'leftWall') {
                if (!d['left'].includes(block.x)) {
                    d['left'].push(block.x);
                }
            }
            if (block.isCollided(game, false) === 'rightWall') {
                if (!d['right'].includes(block.x)) {
                    d['right'].push(block.x);
                }
            }
            if (block.isCollided(game) === 'bottom') {
                if (!d['bottom'].includes(block.x)) {
                    d['bottom'].push(block.x);
                }
            }
        }
        d['left'].shift();
        d['right'].shift();
        d['bottom'].shift();
        if (d['left'].length > 0) {
            let offset = d['left'].length;
            for (let block of this.blocks) {
                block.x += game.blockWidth * offset;
            }
        }
        if (d['right'].length > 0) {
            let offset = d['right'].length;
            for (let block of this.blocks) {
                block.x -= game.blockWidth * offset;
            }
        }
        if (d['bottom'].length > 0) {
            let offset = d['bottom'].length;
            for (let block of this.blocks) {
                block.y -= game.blockWidth * offset;
            }
        }
        this.render(game.gameCtx);
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