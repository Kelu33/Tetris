console.log('objects.js');

class Game {
    constructor() {
        this.level = 10;
        this.blocks = [];
        this.color1 = 'rgb(127.5, 127.5, 127.5)';
        this.color2 = 'rgb(255, 255, 255)';
    }
    setup(backgroundCtx, uiCtx) {
        let block = new Block();
        let c;
        for (let i = 0; i < 21; i++) {
            for (let j = 0; j< 24; j++) {
                if (j > 5 && j < 16) c = this.color1;
                else c = this.color2;
                block.color = c;
                block.x = j*block.width;
                block.y = i*block.height;
                block.render(backgroundCtx);
            }
        }
        let frame = block;
        frame.color = this.color1;
        frame.x = 0;
        frame.y = 0;
        frame.width = 120;
        frame.height = 120;
        frame.render(uiCtx, true);
        frame.y = 120;
        frame.width = 120;
        frame.height = 300;
        frame.render(uiCtx, true);
        frame.x = 320;
        frame.y = 0;
        frame.width = 120;
        frame.height = 300;
        frame.render(uiCtx, true);
        frame.y = 300;
        frame.width = 120;
        frame.height = 120;
        frame.render(uiCtx, true);
    }
}