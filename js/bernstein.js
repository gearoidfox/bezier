"use strict";
var bernsteinCanvas = document.getElementById("bernsteinCanvas");
var bernsteinContext = bernsteinCanvas.getContext("2d");
// divider between left and right half:
var xoffset = bernsteinCanvas.width / 2;

bernsteinContext.font = "bold 8pt Raleway";
var colours = ['#1f78b4', '#33a02c', '#e31a1c', '#ff7f00', '#6a3d9a', '#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6', '#dddd77']

// Allow user to drag control points:
var bernsteinDrag = false; // are we dragging a point?
var bernsteinDragIndex;   // which one?
// Event listeners for dragging points:
bernsteinCanvas.addEventListener("mousedown", bernsteinMouseDown, false);
bernsteinCanvas.addEventListener("mouseup", bernsteinMouseUp, false);
bernsteinCanvas.addEventListener("mousemove", bernsteinMouseMove, false);

bernsteinCanvas.addEventListener("touchstart", bernsteinMouseDown, false);
bernsteinCanvas.addEventListener("touchend", bernsteinMouseUp, false);
bernsteinCanvas.addEventListener("touchmove", bernsteinMouseMove, false);

var maxPoints = 11;
var bernsteinControlPoints = new Array(maxPoints);
var order = document.getElementById("bernsteinOrder").value;
var tmax = document.getElementById("tslider").value;

initBernstein();
drawBernstein();

// Initialise before first drawing:
function initBernstein() {
        bernsteinContext.clearRect(0, 0, bernsteinCanvas.width, bernsteinCanvas.height);
        // Create a slightly random zig-zag of control points: 
        for(let i = 0; i < maxPoints; i++) {
                let y = (75 + Math.random() * 10 + (300 / order) * i) % bernsteinCanvas.height;
                let x = (75 + Math.random() * 100 + (250) * i) % (bernsteinCanvas.width - xoffset );
                bernsteinControlPoints[i] = {x: x, y: y, r:0};
        }
}

// Draw full bernstein canvas:
function drawBernstein() {
        var sliderLabel = document.getElementById("sliderLabel");
        order = document.getElementById("bernsteinOrder").value;
        tmax = document.getElementById("tslider").value;
        sliderLabel.innerHTML = "t=" + tmax;
        // recalculate weights for control points at current t:
        for (var i = 0; i <= order; i++) {
                bernsteinControlPoints[i].r = choose(order, i) * Math.pow(1 - tmax, order - i) * Math.pow(tmax, i);
        }
        drawPoly();
        drawCurve();
}



// Draw Bernstein basis polynomials on left half of canvas:
function drawPoly() {
        // Clear left half of canvas only:
        bernsteinContext.clearRect(0, 0, xoffset, bernsteinCanvas.height);

        // Calculate drawing area for graph:
        let width = xoffset - 1;
        let height = bernsteinCanvas.height;
        let margin = 40;
        let scale = xoffset - 2 * margin; // width of graph area
        let origin = {x: margin, y: margin};

        // Draw title:
        bernsteinContext.strokeStyle = "#555555";
        bernsteinContext.fillStyle = "#555555";
        bernsteinContext.lineWidth = 1;
        bernsteinContext.fillText("Bernstein basis polynomials:", 20 , 20);

        // Draw axes + ticks + labels
        bernsteinContext.beginPath();
        bernsteinContext.moveTo(origin.x, height - origin.y);
        bernsteinContext.lineTo(origin.x + scale, height - origin.y);
        bernsteinContext.moveTo(origin.x, height - origin.y);
        bernsteinContext.lineTo(origin.x, height - (origin.y + scale));
        for(var t = 0; t < 1; t += 0.1) {
                bernsteinContext.moveTo(origin.x + t * scale, height - origin.y);
                bernsteinContext.lineTo(origin.x + t * scale, height - (origin.y - 5));
                bernsteinContext.fillText(t.toFixed(1), origin.x + t * scale - 5, height - (origin.y - 15));

                bernsteinContext.moveTo(origin.x , height - (origin.y + t * scale));
                bernsteinContext.lineTo(origin.x -5, height - (origin.y + t * scale));
                bernsteinContext.fillText(t.toFixed(1), origin.x - 20, height - (origin.y + t * scale));
        }
        bernsteinContext.fillText("t", origin.x  + scale / 2, height - (origin.y - 30));
        bernsteinContext.stroke();
        bernsteinContext.closePath();

        // Draw polynomials on onto graph:
        bernsteinContext.lineWidth = 2;
        for(var i = 0; i <= order; i++) {
                bernsteinContext.strokeStyle = colours[i];
                bernsteinContext.fillStyle = colours[i];

                // Draw polynomial:
                bernsteinContext.beginPath();
                t = 0
                let x = origin.x + scale * t;
                let y = height - (origin.y + scale * choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i));
                bernsteinContext.moveTo(x, y);
                for(var tx = 1; tx <= 100; tx++){
                        t = tx / 100;
                        x = origin.x + scale * t;
                        y = height - (origin.y + scale * choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i));
                        bernsteinContext.lineTo(x, y);
                }
                bernsteinContext.stroke();
                bernsteinContext.closePath();

                // Highlight current point with a circle:
                x = origin.x + scale * tmax;
                y = height - (origin.y + scale * bernsteinControlPoints[i].r);
                bernsteinContext.beginPath();
                bernsteinContext.arc(x, y, 5, 0, 2*Math.PI);
                bernsteinContext.stroke();

                // Add current polynomial to key:
                // text:
                y = height - (origin.y + scale - 20 * i);
                x = origin.x + scale / 2;
                bernsteinContext.closePath;
                bernsteinContext.beginPath();
                bernsteinContext.fillText("b(" + i + "," + order + ")", x, y);
                // line:
                bernsteinContext.moveTo(x - 5, y - 3);
                bernsteinContext.lineTo(x - 30, y - 3);
                bernsteinContext.stroke();
                bernsteinContext.closePath;
        }
}

// Draw Bezier curve on right half of canvas
function drawCurve() {
        var i;

        // Clear right half of canvas + a little bit over the centre line:
        bernsteinContext.clearRect(xoffset - 30, 0, bernsteinCanvas.width, bernsteinCanvas.height);

        // Get drawing options:
        var drawLines = document.getElementById("bernsteinDrawLines").checked;
        var drawPoints = document.getElementById("bernsteinDrawPoints").checked;
        var drawLabels = document.getElementById("bernsteinDrawLabels").checked;

        // Draw title 
        bernsteinContext.fillStyle="#555555";
        bernsteinContext.fillText("Bézier curve:", xoffset + 20 , 20);
        bernsteinContext.stroke();

        bernsteinContext.lineWidth = 1;
        bernsteinContext.strokeStyle = "#d0e1f9";
        bernsteinContext.beginPath()
        bernsteinContext.lineWidth = 1;
        bernsteinContext.strokeStyle = "#283655";
        bernsteinContext.moveTo(xoffset, 0);
        bernsteinContext.lineTo(xoffset, bernsteinCanvas.height);
        bernsteinContext.stroke();
        bernsteinContext.closePath();

        /*
         * Draw control points:
         */
        if(drawPoints == true) {
                for(i = 0; i <= order; i++) {
                        bernsteinContext.strokeStyle = colours[i];
                        bernsteinContext.fillStyle = colours[i];
                        let radius = 30 * bernsteinControlPoints[i].r ;
                        bernsteinContext.beginPath();
                        bernsteinContext.arc(xoffset + bernsteinControlPoints[i].x, bernsteinControlPoints[i].y, radius, 0, 2*Math.PI);
                        bernsteinContext.fill();
                        bernsteinContext.closePath();
                }
        }
        /*
         * Draw lines:
         */
        if(drawLines == true) {
                bernsteinContext.beginPath()
                bernsteinContext.lineWidth = 1;
                bernsteinContext.strokeStyle = "#d0e1f9";
                bernsteinContext.moveTo(xoffset + bernsteinControlPoints[0].x, bernsteinControlPoints[0].y);
                for(i = 0; i <= order; i++) {
                        bernsteinContext.lineTo(xoffset + bernsteinControlPoints[i].x, bernsteinControlPoints[i].y);
                }
                bernsteinContext.stroke();
                bernsteinContext.closePath();
        }
        if(drawLabels == true) {
                bernsteinContext.lineWidth = 1;
                bernsteinContext.fillStyle = "#5979bd";
                for(i = 0; i <= order; i++) {
                        bernsteinContext.fillText("P" + i, xoffset + bernsteinControlPoints[i].x - 20, bernsteinControlPoints[i].y);
                }
        }

        /*
         * Draw curve:
         */
        var x;
        var y;
        bernsteinContext.beginPath();
        bernsteinContext.moveTo(xoffset + bernsteinControlPoints[order].x, bernsteinControlPoints[order].y);
        bernsteinContext.strokeStyle = "#d0e1f9";
        bernsteinContext.lineWidth = 2;
        for(var tx = 100; tx >= tmax * 100; tx--){
                let t = tx / 100;
                x = xoffset
                y = 0
                for(i = 0; i <= order; i++) {
                        x += choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i) * bernsteinControlPoints[i].x;
                        y += choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i) * bernsteinControlPoints[i].y;
                }
                bernsteinContext.lineTo(x, y);
        }
        bernsteinContext.stroke();
        bernsteinContext.closePath();

        bernsteinContext.strokeStyle = "#fd602b";
        bernsteinContext.fillStyle = "#fd602b";
        bernsteinContext.lineWidth = 3;
        bernsteinContext.beginPath();
        bernsteinContext.moveTo(xoffset + bernsteinControlPoints[0].x, bernsteinControlPoints[0].y);
        let txmax = tmax  * 100;
        for(tx = 0; tx <= txmax; tx ++){
                let t = tx / 100;
                x = xoffset
                y = 0
                for(i = 0; i <= order; i++) {
                        x += choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i) * bernsteinControlPoints[i].x;
                        y += choose(order, i) * Math.pow(1 - t, order - i) * Math.pow(t, i) * bernsteinControlPoints[i].y;
                }
                bernsteinContext.lineTo(x, y);
        }
        bernsteinContext.stroke();
        bernsteinContext.closePath();

        bernsteinContext.beginPath();
        bernsteinContext.arc(x, y, 4, 0, 2*Math.PI);
        bernsteinContext.fill();
        bernsteinContext.closePath();
        bernsteinContext.fillText("B(" + tmax + ")", x + 5, y);


}


function choose(n, k) {
        return fact(n) / (fact(k)  * fact(n - k));
}

function fact(n) {
        if(n == 0) return 1;
        if(n == 1) return 1;
        return n * fact(n - 1);
}

function bernsteinMouseDown(event) {
        let bernsteinThreshold = 6
        if(event.target == bernsteinCanvas) {
                event.preventDefault();
        }
        var mouseX;
        var mouseY;
        if(event.offsetX){
                mouseX = event.offsetX;
                mouseY = event.offsetY;
        } else {
                bernsteinThreshold = 11;
                var rect = bernsteinCanvas.getBoundingClientRect();
                mouseX =  event.touches[0].pageX - rect.left- window.scrollX;
                mouseY = event.touches[0].pageY - rect.top - window.scrollY;
                console.log(rect.left, rect.top, mouseX, mouseY);

        }
        for(var i = 0; i <= order; i++) {
                let xdiff = xoffset + bernsteinControlPoints[i].x - mouseX;
                let ydiff = bernsteinControlPoints[i].y - mouseY;
                if(Math.abs(xdiff) < bernsteinThreshold && Math.abs(ydiff) < bernsteinThreshold) {
                        bernsteinDrag = true;
                        bernsteinDragIndex = i;
                        break;
                }
        }
}

function bernsteinMouseUp(event) {
        bernsteinDrag = false;
}

function bernsteinMouseMove(event) {
        if(bernsteinDrag) {
                var mouseX;
                var mouseY;
                if(event.offsetX){
                        mouseX = event.offsetX;
                        mouseY = event.offsetY;
                } else {
                        var rect = bernsteinCanvas.getBoundingClientRect();
                        mouseX =  event.touches[0].pageX - rect.left- window.scrollX;
                        mouseY = event.touches[0].pageY - rect.top - window.scrollY;

                }
                let x = mouseX;
                let r = bernsteinControlPoints[bernsteinDragIndex].r;
                if(x <= xoffset + 20 ){
                        x = xoffset + 20;
                }
                bernsteinControlPoints[bernsteinDragIndex] = {x: x - xoffset, y: mouseY, r: r };
                drawCurve();
        }
}

