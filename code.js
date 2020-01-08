"use strict";
const CVS = document.getElementById("cvs");
const CTX = CVS.getContext("2d");
CTX.scale(20, 20);

function Game() {
    this.xy = 25;
    this.dir = "right";
    this.tail = 5;
    this.score = 0;
    this.grow = false;
    this.speed = 200;
    this.food = {
        x: null,
        y: null,
        eat: true
    }
}

const GAME = new Game();

const TAB = new Array();

TAB.createCvs = function () {
    for (let i = 0; i < GAME.xy; i++) {
        this.push(new Array(GAME.xy).fill("null"));
    }
}

TAB.createSnake = function () {
    for (let i = 0; i < GAME.tail; i++) {
        this[0][i] = i;
    }
}

TAB.getMinXY = function () {
    let min = Math.min.apply(null, this.flat().filter(function (value) {
        return typeof value === "number";
    }))
    for (let y = 0; y < GAME.xy; y++) {
        for (let x = 0; x < GAME.xy; x++) {
            if (this[y][x] === min) {
                return { y, x };
            }
        }
    }
}

TAB.getMaxXY = function () {
    let max = Math.max.apply(null, this.flat().filter(function (value) {
        return typeof value === "number";
    }))
    for (let y = 0; y < GAME.xy; y++) {
        for (let x = 0; x < GAME.xy; x++) {
            if (this[y][x] === max) {
                return { y, x, max };
            }
        }
    }
}

TAB.createCvs();
TAB.createSnake();

function draw(xv, yv) {
    let minXY = TAB.getMinXY();
    let maxXY = TAB.getMaxXY();
    if (GAME.score !== 0 && GAME.score % 500 === 0 && GAME.grow === true) {
        TAB[minXY.y][minXY.x] = 0;
    } else {
        TAB[minXY.y][minXY.x] = "null";
    }
    GAME.grow = false;
    if (maxXY.y + yv <= 24 && maxXY.x + xv <= 24 && maxXY.y + yv >= 0 && maxXY.x + xv >= 0) {
        TAB[maxXY.y + yv][maxXY.x + xv] = maxXY.max + 1;
    }
    else if (maxXY.y + yv > 24) {
        maxXY.y = -1;
        TAB[maxXY.y + yv][maxXY.x + xv] = maxXY.max + 1;
    }
    else if (maxXY.x + xv > 24) {
        maxXY.x = -1;
        TAB[maxXY.y + yv][maxXY.x + xv] = maxXY.max + 1;
    }
    else if (maxXY.y + yv < 0) {
        maxXY.y = 25;
        TAB[maxXY.y + yv][maxXY.x + xv] = maxXY.max + 1;
    }
    else if (maxXY.x + xv < 0) {
        maxXY.x = 25;
        TAB[maxXY.y + yv][maxXY.x + xv] = maxXY.max + 1;
    }
    if (GAME.food.eat === true) {
        GAME.food.x = Math.floor(Math.random() * GAME.xy);
        GAME.food.y = Math.floor(Math.random() * GAME.xy);
        if (typeof TAB[GAME.food.y][GAME.food.x] === "string") {
            TAB[GAME.food.y][GAME.food.x] = "food";
        } else {
            GAME.food.x = Math.floor(Math.random() * GAME.xy);
            GAME.food.y = Math.floor(Math.random() * GAME.xy);
            TAB[GAME.food.y][GAME.food.x] = "food";
        }
        GAME.food.eat = false;
    }
    if (TAB[GAME.food.y][GAME.food.x] === TAB[maxXY.y + yv][maxXY.x + xv]) {
        GAME.food.eat = true;
        GAME.grow = true;
        document.getElementById("score").innerHTML = GAME.score += 100;
    }
    CTX.fillStyle = "black";
    CTX.fillRect(0, 0, CVS.width, CVS.height);
    TAB.forEach((row, y) => {
        row.forEach((value, x) => {
            if (typeof value === "number") {
                CTX.fillStyle = "red";
                CTX.fillRect(x, y, 1, 1);
            } else if (value === "food") {
                CTX.fillStyle = "green";
                CTX.fillRect(x, y, 1, 1);
            }
        })
    })
}
draw(0,0);
var speed = GAME.speed;
var add = GAME.speed;
function timer(time) {
    if (time >= add) {
        add += speed;
        if (GAME.dir === "right") {
            draw(1, 0);
        }
        if (GAME.dir === "left") {
            draw(-1, 0);
        }
        if (GAME.dir === "top") {
            draw(0, -1);
        }
        if (GAME.dir === "bottom") {
            draw(0, 1);
        }
    }
    if(document.visibilityState === "visible"){
        requestAnimationFrame(timer);
    } else {
        cancelAnimationFrame(timer);         
    }
}
timer();
var pre = null;
document.addEventListener("keydown", (event) => {
    switch (event.keyCode) {
        case 37:
            if (pre !== "right") {
                GAME.dir = "left";
                pre = GAME.dir;
            }
            break;
        case 38:
            if (pre !== "bottom") {
                GAME.dir = "top";
                pre = GAME.dir;
            }
            break;
        case 39:
            if (pre !== "left") {
                GAME.dir = "right";
                pre = GAME.dir;
            }
            break;
        case 40:
            if (pre !== "top") {
                GAME.dir = "bottom";
                pre = GAME.dir;
            }
            break;
    }
})

window.onerror = function () {
    alert("你死了,您的最终得分是"+GAME.score+",请再接再厉!");
    location.reload();
}