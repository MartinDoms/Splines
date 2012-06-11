// Common code for drawing curves on a canvas and interacting with
// mouse events.

function point(x, y) {
	return {
		x:x,
		y:y,
		mult: function(s) { return point(this.x * s, this.y * s); },
		add: function(p) { return point(this.x + p.x, this.y + p.y) }
	};
}

function lineSegment(p0, p1, ctx) {
	ctx.beginPath();
	ctx.moveTo(p0.x,p0.y);
	ctx.lineTo(p1.x,p1.y);
	ctx.stroke();
	ctx.closePath();
}

function circlePoint(p, ctx) {
	ctx.beginPath();
	ctx.arc(p.x, p.y, 4, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.stroke();
}
	
function pointDist(p0,p1) {
	var x = p0.x - p1.x;
	var y = p0.y - p1.y;
	return Math.sqrt(x*x + y*y);
}

function dot(v1, v2) {
	var sum = 0;
	for (var i = 0; i < v1.length; i++) {
		sum += v1[i]*v2[i];
	}
	return sum;
}

var pointOnLine = function(t, p0, p1) {
	return point(p0.x + t * (p1.x-p0.x),
				 p0.y + t * (p1.y-p0.y));
}

var CurveCanvas = function(canvas, initialCtrlPoints, curveFunction, drawCallback) {
	var that = this;
	this.canvas = canvas;
	this.controlPoints = initialCtrlPoints;
	this.curveFunction = curveFunction;
	this.drawCallback = drawCallback;
	var lineSegments = 24;
	var dragging = false;
	
	canvas.addEventListener("mousemove", mouseMove);
	canvas.addEventListener("mouseup", mouseUp);
	canvas.addEventListener("mousedown", mouseDown);
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "#000";
	
	

	// gets the mouse position on a canvas from a mouse event object
	var getMousePos = function(canvas, evt){
		var obj = canvas;
		var top = 0;
		var left = 0;
		while (obj && obj.tagName != 'BODY') {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}
		
		// return relative mouse position
		var mouseX = evt.clientX - left + window.pageXOffset;
		var mouseY = evt.clientY - top + window.pageYOffset;
		return point(mouseX,mouseY);
	}
	
	this.redraw = function(canvas) {	
		// clears the canvas
		that.canvas.width = that.canvas.width;
		for (var i = 0; i < that.controlPoints.length; i++) {
			var pt = that.controlPoints[i];
			ctx.strokeStyle = '#aad';
			circlePoint(pt,ctx);
			if (i < that.controlPoints.length-1)
				lineSegment(that.controlPoints[i],that.controlPoints[i+1], ctx);
		}
		
		var p = [];
		for (var j = 0; j < lineSegments+1; j++) {
			p.push(curveFunction(that.controlPoints, j/lineSegments));
		}
		curveSegment(p, ctx);
	}

	var pointDist = function(p1, p2) {
		var dx = p1.x - p2.x;
		var dy = p1.y - p2.y;
		return Math.sqrt(dx*dx + dy*dy);
	}

	var curveSegment = function(points, ctx) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#000';
		for (var i = 0; i < points.length-1; i++) {
			lineSegment(points[i], points[i+1], ctx);
		}
	}	
	
	function mouseMove(e) {
		that.canvas.width = 600;
		that.redraw();
		var pos = getMousePos(that.canvas, e);

		var t = (pos.x-20)/560;
		if (t < 0) t = 0;
		else if (t > 1) t = 1;
		var curvePoint = curveFunction(that.controlPoints,t);

		for (var i = 0; i < that.controlPoints.length; i++) {
			if (pointDist(pos, that.controlPoints[i]) < 8) {
				document.body.style.cursor = "move";
				break;
			}
			else document.body.style.cursor = "default";
		}
		
		if (dragging) {
			dragPoint.x = pos.x;
			dragPoint.y = pos.y;
		}
		else if (pos.y < 185 && pos.y > 15) {
			that.drawCallback(t, that.controlPoints, ctx);
		}
	}

	function mouseDown(e) {
		var pos = getMousePos(that.canvas,e);
		for (var i = 0; i < that.controlPoints.length; i++) {
			if (pointDist(pos, that.controlPoints[i]) < 8) {
				document.body.style.cursor = "pointer";
				dragging = true;
				dragPoint = that.controlPoints[i];
				break;
			}
		}
	}
	
	function mouseUp(e) {
		dragging = false;
	}
	
	that.redraw();
};