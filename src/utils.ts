// consider it as velocity because it times time equals distance
type Vel = any | ((t:number)=>any)

function value(s: Vel, t: number): number {
    if (s instanceof Function){
        return s(t)
    }
    return s
}

function bezier(x2:number, y2:number, x3:number, y3:number, t_scale:number=1, dis_scale:number=1):(t:number)=>number{
    return function(t:number){
        t /= t_scale
        if (t > 1) return dis_scale
        else if (t < 0) return 0
        // let x = 0*(1-t)**3 + 3*x2*t*(1-t)**2+ 3*x3*t**2*(1-t) + 1*t**3
        // let y = 0*(1-t)**3 + 3*y2*t*(1-t)**2+ 3*y3*t**2*(1-t) + 1*t**3
        else {
            let y = (3*y2-3*y3+1)*t**3 + (-6*y2+3*y3)*t**2 + (-3*0+3*y2)*t
            return y * dis_scale
        }
        
    }
}

export {value, bezier, Vel}
// console.log(arcToBezier(8, 4.5, 3, 0, Math.PI/2*3))