import {CanvasRenderingContext2D as Ctx} from 'canvas'
import { Point, PenPoint } from './point'
import { value, Vel } from './utils'

abstract class Element {
    _t:number = 0
    abstract t:number
    pos: Point          // absolute position of anchor point
    
    constructor(pos:Point){
        this.pos = pos
    }

    abstract paint(ctx:Ctx):void
}

class Geometry extends Element{
    // the pen_points of its derived class will be generated automatically according to geometric params(radius, side length...)
    // transforming ensure pen_points automatically generated won't be influenced
    private transforming:boolean = false

    set t(t:number){
        this._t = t
        this.compute()
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

    compute(){}

    // addPenPoints(...pps: PenPoint[]){
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

class Line extends Geometry {
    constructor(x, y, length, angle){
        super(x, y)
    }
}

class Squre extends Geometry {
    center: Point       //

    private _width:Vel = 1
    set width(width:Vel){this._width = width}
    get width(): number{return value(this._width, this.t)}

    private _height:Vel = 1
    set height(height:Vel){this._height = height}
    get height(): number{return value(this._height, this.t)}


}

class Arc extends Geometry {
    center: Point

    private _r:Vel = 1
    set r(r:Vel){this._r = r; this.compute()}
    get r(): number{return value(this._r, this.t)}
    
    private _start_angle:Vel = 0
    set start_angle(start_angle:Vel){this._start_angle = start_angle; this.compute()}
    get start_angle(): number{return value(this._start_angle, this.t)}
    
    private _end_angle:Vel = 2*Math.PI
    set end_angle(end_angle:Vel){this._end_angle = end_angle; this.compute()}
    get end_angle(): number{return value(this._end_angle, this.t)}

    constructor(x:Vel=0, y:Vel=0, r:Vel=0, start_angle:Vel=0, end_angel:Vel=2*Math.PI){
        super(x, y)
        this.center = new Point(x, y)
        this.r = r
        this.start_angle = start_angle
        this.end_angle = end_angel
    }

    
    private arcData2PenPoint(x:number, y:number, r:number, start_angel:number, end_angel:number):PenPoint[]{
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
            let pps:PenPoint[] = this.arcData2PenPoint(x, y, r, start_angel, start_angel + Math.PI/2)
            let l = this.arcData2PenPoint(x, y, r, start_angel + Math.PI/2, end_angel)
            pps[pps.length-1].c2.x = l[0].c2.x
            pps[pps.length-1].c2.y = l[0].c2.y
            for (let i = 1;i<l.length;i++){
                pps.push(l[i])
            }
            return pps
        }
    
    }

    compute() { this.pen_points = this.arcData2PenPoint(this.center.x, this.center.y, this.r,this.start_angle, this.end_angle) }
}

export {Element, Geometry, Arc}