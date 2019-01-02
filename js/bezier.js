"use strict";
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

// Allow user to drag control points:
var drag = false;
var dragIndex;
canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);

var maxPoints = 11;
var order = document.getElementById("order").value;
var controlPoints = new Array(maxPoints);

init();
draw();

function init() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < maxPoints; i++) {
                let y = (75 + Math.random() * 10 + (300 / order) * i) % canvas.height;
                let x = (75 + Math.random() * 100 + (250) * i) % canvas.width;
                controlPoints[i] = {x: x, y: y};
        }
}

function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        order = document.getElementById("order").value;
        drawLines = document.getElementById("drawLines").checked;
        drawPoints = document.getElementById("drawPoints").checked;
        drawLabels = document.getElementById("drawLabels").checked;
        context.lineWidth = 1;
        context.strokeStyle = "#d0e1f9";
        var i;
        /*
         * Draw lines:
         */
        if(drawLines == true) {
                context.beginPath()
                context.lineWidth = 1;
                context.strokeStyle = "#d0e1f9";
                context.moveTo(controlPoints[0].x, controlPoints[0].y);
                for(i = 0; i <= order; i++) {
                        context.lineTo(controlPoints[i].x, controlPoints[i].y);
                }
                context.stroke();
                context.closePath();
        }
        if(drawLabels == true) {
                context.lineWidth = 1;
                context.fillStyle = "#5979bd";
                for(i = 0; i <= order; i++) {
                        context.fillText("P" + i, controlPoints[i].x - 20, controlPoints[i].y);
                }
        }
        /*
         * Draw control points:
         */
        if(drawPoints == true) {
                context.strokeStyle = "#d0e1f9";
                context.fillStyle = "#283655";
                for(i = 0; i <= order; i++) {
                        context.beginPath();
                        context.arc(controlPoints[i].x, controlPoints[i].y, 4, 0, 2*Math.PI);
                        context.fill();
                        context.closePath();
                }
        }

        /*
         * Draw curve:
         */
        context.strokeStyle = "#fd602b";
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(controlPoints[0].x, controlPoints[0].y);
        for(var tx = 0; tx <= 100; tx++){
                let t = tx / 100;
                let x = 0
                let y = 0
                for(i = 0; i <= order; i++) {
                        x += choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i) * controlPoints[i].x;
                        y += choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i) * controlPoints[i].y;
                }
                context.lineTo(x, y);
        }
        context.stroke();
        context.closePath();
}


function choose(n, k) {
        return fact(n) / (fact(k)  * fact(n - k));
}

function fact(n) {
        if(n == 0) return 1;
        if(n == 1) return 1;
        return n * fact(n - 1);
}

function mouseDown(event) {
        for(var i = 0; i <= order; i++) {
                let xdiff = controlPoints[i].x - event.offsetX;
                let ydiff = controlPoints[i].y - event.offsetY;
                if(Math.abs(xdiff) < 6 && Math.abs(ydiff) < 6) {
                        drag = true;
                        dragIndex = i;
                        break;
                }
        }
}

function mouseUp(event) {
        drag = false;
}

function mouseMove(event) {
        if(drag) {
                controlPoints[dragIndex] = {x: event.offsetX, y: event.offsetY};
                draw();
        }
}

