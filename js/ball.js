import Particle from './particle.js'
import {getDist, randomFloatFromRange} from './utils.js'

export default class Ball{
    constructor(canvas, ctx, x, y, radius, color, particlesArr, velX, velY, dontCheck){
        this.canvas = canvas
        this.ctx = ctx
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = {
            x: velX || 0,
            y: velY || 0
        }
        this.acc = 0.01
        this.origin = { x: x, y: y }
        this.dontCheck = dontCheck
        this.opacity = 1
        this.particlesArr = particlesArr
        this.collided = false
    }

    
    draw(){
        this.ctx.save()
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.ctx.fillStyle = this.color
        this.ctx.shadowColor = this.color
        this.shadowBlur = 25
        this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 0;
        this.ctx.globalAlpha = this.opacity
        this.ctx.fill()
        this.ctx.closePath()
        this.ctx.restore()
    }


    update(ballsArr, updateVel = false){
        if(this.origin.y <= 0){
            this.y += this.velocity.y
        }
        else if(this.origin.y >= this.canvas.height){
            this.y -= this.velocity.y
        }
        if(updateVel == true){
            this.y += this.velocity.y
            this.x += this.velocity.x
        }
        
        this.collisionDetect(ballsArr)
        this.draw()
    }

    collisionDetect(ballsArr){
        for(let i = 0; i < ballsArr.length; i++){
            if(this === ballsArr[i] || this.dontCheck) continue
            let distBetweenPoints = getDist(this.x, this.y, ballsArr[i].x, ballsArr[i].y) - this.radius * 2
            if(distBetweenPoints < 0){
                if(this.color == ballsArr[i].color){
                    for(let j = 0; j < Math.floor(randomFloatFromRange(20, 25)); j++){
                        this.break(this.particlesArr, 0.4, 0.8)
                        this.collided = true
                    }
                    this.opacity = 0
                }else if(this.color != ballsArr[i].color){
                    for(let j = 0; j < Math.floor(randomFloatFromRange(40, 55)); j++){
                        ballsArr.forEach((ball) => {
                            ball.opacity = 0
                            this.break(this.particlesArr, 2, 5, ball.x, ball.y, ball.color)
                        })
                        this.particlesArr.forEach((particle) => {
                            particle.gravity = 0
                        })
                    }
                }
            }
        }
    }

    edgeDetect(){
        if (this.y + this.radius + this.velocity.y > this.canvas.height) {
            this.velocity.y *= -1
        }
        else if(this.y - this.radius <= 0){
            this.velocity.y *= -1
        }

        if (this.x + this.radius + this.velocity.x > this.canvas.width) {
            this.velocity.x *= -1
        }
        else if (this.x - this.radius <= 0) {
            this.velocity.x *= -1
        }
    }


    break(arr, minRadius, maxRadius, x, y, c){
        var randRadius = randomFloatFromRange(minRadius, maxRadius)
        var randVel = {
            x: randomFloatFromRange(-20, 20),
            y: randomFloatFromRange(-20, 20),
        }
        if(this.origin.y <= 0){
            let spawnX , spawnY
            let color
            if(x && y){
                spawnX = x
                spawnY = y
                color = c
            }else{
                spawnX = this.x
                spawnY = this.y + this.radius
                color = this.color
            }
                arr.push(
                    new Particle(
                        this.canvas, this.ctx,
                        spawnX, spawnY,
                        randRadius, color , randVel.x, randVel.y
                    )
                )
        }else{
            let spawnX , spawnY
            let color
            if(x && y){
                spawnX = x
                spawnY = y
                color = c
            }else{
                spawnX = this.x
                spawnY = this.y - this.radius
                color = this.color
            }
                arr.push(
                    new Particle(
                        this.canvas, this.ctx,
                        spawnX, spawnY,
                        randRadius, color , randVel.x, randVel.y
                    )
                )
        }
    }

    change(colorDefault, colorTochange){
        if(this.color != colorDefault){
            this.color = colorDefault
        }else{
            this.color = colorTochange
        }
    }
}
