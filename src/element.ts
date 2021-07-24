import {CanvasRenderingContext2D as Ctx} from 'canvas'
import { ENFILE } from 'constants'
import { start } from 'repl'
import { PenPoint } from './point'
import { value, arc2Bezier, Stat } from './utils'

abstract class Element {
    x:Stat
    y:Stat
    _x
    _y
    // computed: boolean = false
    constructor(x:Stat=0, y:Stat=0){
        this._x = x
        this._y = y
        // this.computed = false
    }

    compute(time: number){
        this.x = this._x
        this.y = this._y
        this.x = value(this.x, time)
        this.y = value(this.y, time)
    }

    scale(scale: number){
        this.x = <number>this.x * scale
        this.y = <number>this.y * scale
    }

    abstract paint(ctx:Ctx):void
}

class Geometry extends Element{
    fill:boolean = false
    _fill:boolean = false
    pen_points:PenPoint[] = []
    constructor(x:Stat, y:Stat){
        super(x, y)
    }

    addPenPoint(pps: PenPoint[]){
        for (let i of pps) this.pen_points.push(i)
    }

    compute(time:number){
        super.compute(time)
        this.fill = this._fill

        for (let pen_point of this.pen_points) {
            pen_point.compute(time, this._x, this._y)
        }
    }

    scale(scale:number){
        super.scale(scale)
        for (let pen_point of this.pen_points) {
            pen_point.scale(scale)
        }
    }

    paint(ctx:Ctx){
        // if (this.fill) ctx.fillStyle = 'black'
        // else ctx.strokeStyle = 'black'
        ctx.lineWidth = 0.1
        ctx.beginPath()
        ctx.moveTo(this.pen_points[0].p.x, this.pen_points[0].p.y)
        // console.log(this.pen_points[0].p.x/120, this.pen_points[0].p.y/120)
        for (let i = 0, l = this.pen_points.length; i < l-1 ;i++) {
            let now = this.pen_points[i]
            let next = this.pen_points[i+1]
            ctx.bezierCurveTo(now.c2.x, now.c2.y, next.c1.x, next.c1.y, next.p.x, next.p.y)
            // console.log(now.c2.x/120, now.c2.y/120, next.c1.x/120, next.c1.y/120, next.p.x/120, next.p.y/120)
        }
        if (this.fill) { ctx.fillStyle = 'black'; ctx.fill() }
        else { ctx.strokeStyle = 'black'; ctx.stroke()}
    }
}

class Arc extends Geometry {
    r
    _r:Stat
    start_angel
    _start_angel:Stat
    end_angel
    _end_angel:Stat
    constructor(x:Stat, y:Stat, r:Stat, start_angrl:Stat, end_angel:Stat){
        super(x, y)
        this.r = r
        this.start_angel = start_angrl
        this.end_angel = end_angel
        
    }
    compute(t:number) {
        this._r = this.r
        this._start_angel = this.start_angel
        this._end_angel = this.end_angel
        let pps = arc2Bezier(0, 0, value(this._r, t), value(this._start_angel, t), value(this._end_angel, t))
        this.pen_points = pps
        super.compute(t)
    }
}

export {Element, Geometry, Arc}