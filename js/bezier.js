"use strict";
var bezierCanvas = document.getElementById("bezierCanvas");
var bezierContext = bezierCanvas.getContext("2d");

bezierContext.font = "bold 8pt Raleway";

// Allow user to drag control points:
var drag = false;
var dragIndex;
bezierCanvas.addEventListener("touchstart", bezierMouseDown, false);
bezierCanvas.addEventListener("mousedown", bezierMouseDown, false);
bezierCanvas.addEventListener("touchend", bezierMouseUp, false);
bezierCanvas.addEventListener("mouseup", bezierMouseUp, false);
bezierCanvas.addEventListener("touchmove", bezierMouseMove, false);
bezierCanvas.addEventListener("mousemove", bezierMouseMove, false);

var maxPoints = 11;
var order = document.getElementById("order").value;
var bezierControlPoints = new Array(maxPoints);


function initBezier() {
        bezierContext.clearRect(0, 0, bezierCanvas.width, bezierCanvas.height);
        for(let i = 0; i < maxPoints; i++) {
                let y = (75 + Math.random() * 10 + (300 / order) * i) % bezierCanvas.height;
                let x = (75 + Math.random() * 100 + (250) * i) % bezierCanvas.width;
                bezierControlPoints[i] = {x: x, y: y};
        }
}

function drawBezier() {
        bezierContext.clearRect(0, 0, bezierCanvas.width, bezierCanvas.height);
        order = document.getElementById("order").value;
        var drawLines = document.getElementById("drawLines").checked;
        var drawPoints = document.getElementById("drawPoints").checked;
        var drawLabels = document.getElementById("drawLabels").checked;
        bezierContext.lineWidth = 1;
        bezierContext.strokeStyle = "#d0e1f9";
        var i;
        /*
         * Draw lines:
         */
        if(drawLines == true) {
                bezierContext.beginPath()
                bezierContext.lineWidth = 1;
                bezierContext.strokeStyle = "#d0e1f9";
                bezierContext.moveTo(bezierControlPoints[0].x, bezierControlPoints[0].y);
                for(i = 0; i <= order; i++) {
                        bezierContext.lineTo(bezierControlPoints[i].x, bezierControlPoints[i].y);
                }
                bezierContext.stroke();
                bezierContext.closePath();
        }
        if(drawLabels == true) {
                bezierContext.lineWidth = 1;
                bezierContext.fillStyle = "#5979bd";
                for(i = 0; i <= order; i++) {
                        bezierContext.fillText("P" + i, bezierControlPoints[i].x - 20, bezierControlPoints[i].y);
                }
        }
        /*
         * Draw control points:
         */
        if(drawPoints == true) {
                bezierContext.strokeStyle = "#d0e1f9";
                bezierContext.fillStyle = "#d0e1f9";
                for(i = 0; i <= order; i++) {
                        bezierContext.beginPath();
                        bezierContext.arc(bezierControlPoints[i].x, bezierControlPoints[i].y, 4, 0, 2*Math.PI);
                        bezierContext.fill();
                        bezierContext.closePath();
                }
        }

        /*
         * Draw curve:
         */
        bezierContext.strokeStyle = "#fd602b";
        bezierContext.lineWidth = 3;
        bezierContext.beginPath();
        bezierContext.moveTo(bezierControlPoints[0].x, bezierControlPoints[0].y);
        for(var tx = 0; tx <= 100; tx++){
                let t = tx / 100;
                let x = 0
                let y = 0
                for(i = 0; i <= order; i++) {
                        x += choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i) * bezierControlPoints[i].x;
                        y += choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i) * bezierControlPoints[i].y;
                }
                bezierContext.lineTo(x, y);
        }
        bezierContext.stroke();
        bezierContext.closePath();
}


function choose(n, k) {
        return fact(n) / (fact(k)  * fact(n - k));
}

function fact(n) {
        if(n == 0) return 1;
        if(n == 1) return 1;
        return n * fact(n - 1);
}

function bezierMouseDown(event) {
        for(var i = 0; i <= order; i++) {
                let xdiff = bezierControlPoints[i].x - event.offsetX;
                let ydiff = bezierControlPoints[i].y - event.offsetY;
                if(Math.abs(xdiff) < 6 && Math.abs(ydiff) < 6) {
                        drag = true;
                        dragIndex = i;
                        break;
                }
        }
}

function bezierMouseUp(event) {
        drag = false;
}

function bezierMouseMove(event) {
        if(drag) {
                bezierControlPoints[dragIndex] = {x: event.offsetX, y: event.offsetY};
                drawBezier();
        }
}

