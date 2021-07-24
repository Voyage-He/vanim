import {Stat, value} from './utils'

class Point {
    x:number=0;y:number=0
    _x:number; _y:number
    constructor(x:number, y:number){
        this._x = x
        this._y = y
    }

    compute(t:number, x:Stat, y:Stat){
        this.x = this._x
        this.y = this._y
        this.x = value(this.x, t)
        this.y = value(this.y, t)
        this.x += value(x, t)
        this.y += value(y, t)
    }

    scale(s:number){
        this.x *= s
        this.y *= s
    }
}

class PenPoint {
    p:Point
    c1:Point
    c2:Point
    constructor(x:number, y:number, x1?:number, y1?:number, x2?:number, y2?:number){
        // console.log(arguments)
        this.p = new Point(x, y)
        if (arguments.length == 2) {
            this.c1 = new Point(x, y)
            this.c2 = new Point(x, y)
            return
        }
        if (typeof x1 !== 'undefined' && typeof y1 !== 'undefined') {
            this.c1 = new Point(x1, y1)
            this.c2 = new Point(x, y)
        
            if (typeof x2 !== 'undefined' && typeof y2 !== 'undefined') {
                this.c1 = new Point(x1, y1)
                this.c2 = new Point(x2, y2)
            }
        } else throw '111'
    }

    compute(t:number, x:Stat, y:Stat){
        this.p.compute(t, x, y)
        this.c1.compute(t, x, y)
        this.c2.compute(t, x, y)
        // console.log(this)
    }

    scale(s:number){
        this.p.scale(s)
        this.c1.scale(s)
        this.c2.scale(s)
    }
}

export {Point, PenPoint}