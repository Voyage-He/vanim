import {CanvasRenderingContext2D as Ctx} from 'canvas'
import { Point, PenPoint } from './point'
import { value, Vel } from './utils'

abstract class Element {
    _t:number
    abstract t:number
    pos: Point          // absolute position of anchor point
    
    constructor(pos:Point){
        this.pos = pos
    }

    abstract paint(ctx:Ctx):void
}

class Geometry extends Element{
    set t(t:number){
        this._t = t
        for(let i of this.pen_points){
            i.t = t
        }
    }
    get t(){return this._t}

    pen_points:PenPoint[] = []

    private _line_width:Vel = 0.1
    set line_width(line_width:Vel){this._line_width = line_width}
    get line_width(): number{return value(this._line_width, this.t)}

    private _fill:Vel = false
    set fill(fill:Vel){this._fill = fill}
    get fill(): number{return value(this._fill, this.t)}
    
    private _color:Vel = '#000000'
    set color(color:Vel){this._color = color}
    get color(): number{return value(this._color, this.t)}
    
    constructor(x:Vel, y:Vel){ super(new Point(x, y)) }

    // addPenPoints(pps: PenPoint[]){
    //     for (let i of pps) this.pen_points.push(i)
    // } 这个竟然没用到??

    paint(ctx:Ctx){
        ctx.lineWidth = this.line_width
        ctx.beginPath()
        ctx.moveTo(this.pen_points[0].p.x, this.pen_points[0].p.y)
        for (let i = 0, l = this.pen_points.length; i < l-1 ;i++) {
            let now = this.pen_points[i]
            let next = this.pen_points[i+1]
            ctx.bezierCurveTo(now.c2.x, now.c2.y, next.c1.x, next.c1.y, next.p.x, next.p.y)
        }
        if (this.fill) { ctx.fillStyle = 'black'; ctx.fill() }
        else { ctx.strokeStyle = 'white'; ctx.stroke()}
    }
}

class Squre extends Geometry {
    
}

class Arc extends Geometry {
    center: Point
    r: Vel
    start_angel: Vel
    end_angel: Vel
    constructor(x:Vel=0, y:Vel=0, r:Vel=0, start_angrl:Vel=0, end_angel:Vel=0){
        super(x, y)
        this.center = new Point(x, y)
        this.r = r
        this.start_angel = start_angrl
        this.end_angel = end_angel
    }

    static arc2Bezier(x:number, y:number, r:number, start_angel:number, end_angel:number):PenPoint[]{
        if (end_angel - start_angel <= Math.PI/2) {
            let x0 = x + Math.cos(start_angel)*r
            let y0 = y + Math.sin(start_angel)*r
            let x3 = x + Math.cos(end_angel)*r
            let y3 = y + Math.sin(end_angel)*r
            let h = 4/3*Math.tan((end_angel-start_angel)/4)
            let x1 = x0 - h*(y0-y)
            let y1 = y0 + h*(x0-x)
            let x2 = x3 + h*(y3-y)
            let y2 = y3 - h*(x3-x)
            return [new PenPoint(x0, y0, x0, y0, x1, y1), new PenPoint(x3, y3, x2, y2)]
        } else {
            let pps:PenPoint[] = Arc.arc2Bezier(x, y, r, start_angel, start_angel + Math.PI/2)
            let l = Arc.arc2Bezier(x, y, r, start_angel + Math.PI/2, end_angel)
            pps[pps.length-1].c2.x = l[0].c2.x
            pps[pps.length-1].c2.y = l[0].c2.y
            for (let i = 1;i<l.length;i++){
                pps.push(l[i])
            }
            return pps
        }
    
    }

    compute(t:number) {
        let pps = Arc.arc2Bezier(0, 0, value(this.r, t), value(this.start_angel, t), value(this.end_angel, t))
        this.pen_points = pps
    }
}

export {Element, Geometry, Arc}