class Block {
    constructor(color = false) {
        this.color = 'rgb(127.5, 127.5, 127.5)';
        if (color) this.color = color;
        this.x = 0;
        this.y = 0;
        this.width = 20;
        this.height = 20;
        this.border = 6;
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
    move(ctx, x = 0, y = 0){
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        this.x += x;
        this.y += y;
        this.render(ctx);
    }
}