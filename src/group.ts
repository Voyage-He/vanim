import {createCanvas, CanvasRenderingContext2D as Ctx} from 'canvas'
import {writeFileSync} from 'fs'
import {Element} from './element'


class Group {
    children:Element[] = []

    private _t:number
    set t(t:number){
        this._t = t
        for(let i of this.children){
            i.t = t
        }
    }
    get t(){return this._t}

    add(...element: Element[]){
        for (let i of element) {
            this.children.push(i)
        }
    }

    remove(element:Element){
        this.children.splice(this.children.indexOf(element),1)
    }

}

class Screen extends Group {
    width:number
    height:number
    ctx:Ctx
    constructor(width:number=1920, height:number=1080){
        super()
        this.width = width
        this.height = height
    }

    scale(scale:number){
        this.width *= scale
        this.height *= scale
    }

    paint(){
        if (!(this.ctx instanceof Ctx)){
            console.log(1)
            this.ctx = createCanvas(this.width, this.height).getContext('2d')
            this.ctx.scale(120, 120)
        }
        

        // background
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, 1920, 1080)
        
        for(let i of this.children){
            i.paint(this.ctx)
        }
    }

    renderFrame(time=0, scale=1, output="./test.png"){
        this.t = time
        this.scale(scale)
        this.paint()
        writeFileSync(output, this.ctx.canvas.toBuffer('image/jpeg'))
    }

    renderVideo(){}
}

export {Group, Screen}