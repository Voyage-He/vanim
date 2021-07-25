import {Vel, value} from './utils'

class Point {
    // TODO inefficient due to resetting 't' of every point from Screen
    t:number = 0

    private _x:Vel = 0
    set x(x:Vel){this._x = x}
    get x(): number{return value(this._x, this.t)}

    private _y:Vel = 0
    set y(y:Vel){this._y = y}
    get y(): number{return value(this._y, this.t)}

    constructor(x:Vel=0, y:Vel=0){
        this.x = x
        this.y = y
    }

    transform(p:Point, duration:number, func: (t:number)=>number){
        this.x = (t:number)=>{
            t /= duration
            return (p.x - this.x) * func(t) + this.x
        }
    }
}

class PenPoint {
    private _t:number
    set t(t:number){
        this._t = t
        this.p.t = t
        this.c1.t = t
        this.c2.t = t
    }
    get t(){return this._t}

    p:Point
    c1:Point
    c2:Point
    constructor(x:Vel, y:Vel, x1?:Vel, y1?:Vel, x2?:Vel, y2?:Vel){
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
        } else throw 'illegal params'
    }
}

export {Point, PenPoint}