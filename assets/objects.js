console.log('objects.js');

class Block {
    constructor(color = false) {
        this.color = 'rgb(127.5, 127.5, 127.5)';
        if (color) this.color = color;
        this.x = 0;
        this.y = 0;
        this.width = 20;
    }
    render(
        ctx,
        height = false,
        border = false,
        hollow = false,
        shadow = true
    ) {
        let c = this.color;
        let x = this.x;
        let y = this.y;
        let w = this.width;
        let h = w;
        let b = this.width/10;
        if (height) h = height;
        if (border) b = border;
        ctx.fillStyle = c;
        ctx.fillRect(x, y, w, h);
        if (b < 0.3) {
            if (shadow) {
                ctx.fillStyle = 'rgba(0,0,0,0.125)';
                ctx.fillRect(x+3*b, y+3*b, w-6*b, h-6*b);
            }
            return;
        }
        if (b > w/6) b = w/6;
        let wr,hr;
        let s = 0;
        let i = 0;
        let f = false;
        ctx.save();
        ctx.translate(x+(w/2), y+(h/2));
        while (i < 4){
            s = Math.floor(255 / 3 * i);
            ctx.fillStyle = 'rgba(' + s + ', ' + s + ', ' + s + ',0.5)';
            ctx.rotate((Math.PI/180)*90);
            if (!isEven(i)) {
                wr = w;
                hr = h;
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
                ctx.rotate((Math.PI/180)*180);
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
}