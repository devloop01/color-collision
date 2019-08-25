console.clear()

import Ball from './ball.js'
import {randomFromArray, randomFloatFromRange} from './utils.js'

Splitting()

const canvas = document.querySelector('[data-canvas]')
const ctx = canvas.getContext('2d')

let canvasHeight = innerHeight - 100,
    canvasWidth = 400
canvas.width = canvasWidth
canvas.height = canvasHeight


var colors = ['#e74c3c', '#3498db']

var points = [
    {
        x: canvasWidth / 2,
        y: -50
    },
    {
        x: canvasWidth / 2,
        y: canvasHeight + 50
    }
]

var retryBtn = document.querySelector('.retry-btn')
var retryText = document.querySelector('.retry-text')
var playBtn = document.querySelector('.btn.play')
var startScreen = document.querySelector('.start-screen')

let balls = [],
    particles = []
var redBall, blueBall
var separation = 35
var globalRadius = 18
let generateBall = false
let timeInterval
let velocityOfBall
let failed = false
let timer = 0
let score = 0
let fillColor

function init(){
    balls = []
    particles = []
    uselessBalls = []
    generateBall = true
    timeInterval = 2000
    timer = 0
    velocityOfBall = 4
    score = 0
    fillColor = '#fff'

    blueBall = new Ball(
        canvas, ctx,
        canvasWidth/2, canvasHeight/2 - separation,
        globalRadius, colors[1], particles, 0, 0, true
    )
    redBall = new Ball(
        canvas, ctx,
        canvasWidth/2, canvasHeight/2 + separation,
        globalRadius, colors[0], particles, 0, 0, true
    )
    balls.push(redBall, blueBall)
}

setInterval(() => {
    if(velocityOfBall <= 7){
        velocityOfBall += 0.1
    }else{
        velocityOfBall += 0
    }
}, 1000)


function pushNewBalls(){
    var randomPoint = randomFromArray(points),
        randomColor = randomFromArray(colors)
        balls.push(
            new Ball(
                canvas, ctx,
                randomPoint.x, randomPoint.y,
                globalRadius, randomColor, particles, 0, velocityOfBall, false
            )
        )
}

var uselessBalls = []
function intro(){
    for(let i = 0; i < 20; i++){
        let randVelXY = {
            x: randomFloatFromRange(-5, 5),
            y: randomFloatFromRange(-5, 5)
        }
        let r = randomFloatFromRange(5, 10)
        uselessBalls.push(
            new Ball(
                canvas, ctx, canvasWidth / 2, canvasHeight / 2,
                r, colors[Math.floor(Math.random() * colors.length)],
                particles, randVelXY.x, randVelXY.y, true
            )
        )
    }
    balls.push([...uselessBalls])
}
intro()


function BG_Gradient(color1, color2){
    let bg = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
    bg.addColorStop(0, color1)
    bg.addColorStop(1, color2)
    return bg
}

var background = BG_Gradient('#2c3e50', '#34495e')


function loop(){
    requestAnimationFrame(loop)
    ctx.fillStyle = background
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = fillColor
    ctx.font = '21px sans-serif'
    ctx.fillText(`SCORE : ${score.toString()}`, 20, 35)

    uselessBalls.forEach(ball => {
        ball.update(balls, true)
        ball.edgeDetect()
    })
    if(uselessBalls.length != 0){
        return
    }

    if(balls.length != 0){
        balls.forEach((ball, index) => {
            ball.update(balls)
            if(ball.collided == true){
                score += 10
                fillColor = ball.color
            }
            if(ball.opacity <= 0){
                ball.dontCheck = true
                balls.splice(index, 1)
            }
        })
    }
    if(balls.length == 0 || balls.length == 1){
        failed = true
        generateBall = false
    }
    if(balls.length == 2){
        generateBall = true
    }
    if(timeInterval % timer == 0 && generateBall == true){
        generateBall = false
        pushNewBalls()
    }

    if(particles.length != 0){
        particles.forEach((particle, index) => {
            particle.update()
            if(particle.opacity <= 0.05){
                particles.splice(index, 1)
            }
        })
    }
    if(timer == 600){
        timer = 0
    }

    showHideOptions()
    timer++
    console.log(timer)
}
loop()

function showHideOptions(){
    if(failed == true && generateBall == false){
        retryText.classList.remove('hide')
        retryText.classList.add('show')
        retryBtn.classList.remove('hide')
        retryBtn.classList.add('show')
    }else if(failed == false && generateBall == true){
        retryText.classList.add('hide')
        retryText.classList.remove('show')
        retryBtn.classList.add('hide')
        retryBtn.classList.remove('show')
    }
}

canvas.addEventListener('mousedown', () => {
    redBall.change(colors[0], colors[1])
    blueBall.change(colors[1], colors[0])
})


retryBtn.addEventListener('mousedown', () => {
    failed = false
    init()
})
playBtn.addEventListener('mousedown', () => {
    startScreen.classList.add('hide')
    init()
})