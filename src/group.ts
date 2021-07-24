import {createCanvas, CanvasRenderingContext2D as Ctx} from 'canvas'
import {writeFileSync} from 'fs'
import {Element} from './element'

class Group {
    children:Element[] = []

    add(...element: Element[]){
        for (let i of element) {
            this.children.push(i)
        }
    }

    remove(element:Element){
        this.children.splice(this.children.indexOf(element),1)
    }

    compute(time:number){
        for (let i of this.children) {
            i.compute(time)
        }
    }

    scale(scale:number){
        for (let i of this.children) {
            i.scale(scale)
        }
    }
}

class Screen extends Group {
    width:number=0
    _width:number
    height:number=0
    _height:number
    ctx:Ctx
    constructor(width:number, height:number){
        super()
        this._width = width
        this._height = height
    }

    compute(time:number){
        super.compute(time)
        this.width = this._width
        this.height = this._height
    }

    scale(scale:number){
        this.width *= scale
        this.height *= scale
        // super.scale(scale)
    }

    paint(){
        this.ctx = createCanvas(this.width, this.height).getContext('2d')
        
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, this.width, this.height)
        // this.ctx.lineWidth = 1/120
        this.ctx.scale(120, 120)
        for(let i of this.children){
            i.paint(this.ctx)
        }
    }

    renderFrame(time=0, scale=1, output="./test.png"){
        this.compute(time)
        this.scale(scale)
        this.paint()
        writeFileSync(output, this.ctx.canvas.toBuffer('image/jpeg'))
    }

    renderVideo(){}
}

export {Group, Screen}