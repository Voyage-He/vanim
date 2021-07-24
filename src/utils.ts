import { PenPoint } from "./point"

type Stat = number | ((t:number)=>number)

function value(s: number | ((t:number)=>number), t: number): number {
    if (s instanceof Function){
        return s(t)
    }
    return s
}

function bezier(x2:number, y2:number, x3:number, y3:number, t_scale:number=1, dis_scale:number=1):(t:number)=>number{
    return function(t:number){
        t /= t_scale
        // let x = 0*(1-t)**3 + 3*x2*t*(1-t)**2+ 3*x3*t**2*(1-t) + 1*t**3
        // let y = 0*(1-t)**3 + 3*y2*t*(1-t)**2+ 3*y3*t**2*(1-t) + 1*t**3
        let y = (3*y2-3*y3+1-0)*t**3 + (3*0-6*y2+3*y3)*t**2 + (-3*0+3*y2)*t + 0
        return y * dis_scale
    }
}

function arc2Bezier(x:number, y:number, r:number, start_angel:number, end_angel:number):PenPoint[]{
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
        let pps:PenPoint[] = arc2Bezier(x, y, r, start_angel, start_angel + Math.PI/2)
        let l = arc2Bezier(x, y, r, start_angel + Math.PI/2, end_angel)
        pps[pps.length-1].c2._x = l[0].c2._x
        pps[pps.length-1].c2._y = l[0].c2._y
        for (let i = 1;i<l.length;i++){
            pps.push(l[i])
        }
        return pps
    }

}

export {value, bezier, arc2Bezier, Stat}
// console.log(arcToBezier(8, 4.5, 3, 0, Math.PI/2*3))