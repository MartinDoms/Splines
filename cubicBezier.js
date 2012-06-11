(function() {
	var controlPoints = [point(60,190),point(120,10),point(500,10),point(520,190)];
	var pointBuffer = [];
	var ctx;
	var lineSegments = 24;
	var dragging = false;
	var dragPoint;


	function getMousePos(canvas, evt){
		// get canvas position
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

	function mvMult(m, v) {
		var output = [];
		for (var i = 0; i < m.length; i++) {
			var sum = 0;
			for (var j = 0; j < m.length; j++) {
				sum += v[j] * m[i][j];
			}
			output.push(sum);
		}
		return output;
	}

	function dot(v1, v2) {
		var sum = 0;
		for (var i = 0; i < v1.length; i++) {
			sum += v1[i]*v2[i];
		}
		return sum;
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

	function curveSegment(points, ctx) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#000';
		for (var i = 0; i < points.length-1; i++) {
			lineSegment(points[i], points[i+1], ctx);
		}
	}

	function bezierFunc(points, t) {
		var p0 = points[0];
		var p1 = points[1];
		var p2 = points[2];
		var p3 = points[3];
		var t3 = t*t*t;
		var t2 = t*t;

		var dx = dot([p0.x, p1.x, p2.x, p3.x], [(1-t)*(1-t)*(1-t), 3*(1-t)*(1-t)*t, 3*(1-t)*t2, t3]);
		var dy = dot([p0.y, p1.y, p2.y, p3.y], [(1-t)*(1-t)*(1-t), 3*(1-t)*(1-t)*t, 3*(1-t)*t2, t3]);

		return point(dx,dy);
	}
	
	function cubicBezier(controlPoints, ctx) {
		var p = [];
		for (var j = 0; j < lineSegments+1; j++) {
			p.push(bezierFunc(controlPoints, j/lineSegments));
		}
		curveSegment(p, ctx);
		if (pointBuffer.length == 0) {
			for (var i = 0; i < lineSegments+1; i++) {
				pointBuffer.push(p[i]);
			}
		}
	}

	function redraw() {	
		c.width = c.width;
		for (var i = 0; i < controlPoints.length; i++) {
			var pt = controlPoints[i];
			ctx.strokeStyle = '#aad';
			circlePoint(pt,ctx);
			if (i < controlPoints.length-1)
				lineSegment(controlPoints[i],controlPoints[i+1], ctx);
		}
		
		cubicBezier(controlPoints, ctx);
	}

	function point(x, y) {
		return {
			x:x,
			y:y,
			mult: function(s) { return point(this.x * s, this.y * s); },
			add: function(p) { return point(this.x + p.x, this.y + p.y) }
		};
	}

	function pointDist(p1, p2) {
		var dx = p1.x - p2.x;
		var dy = p1.y - p2.y;
		return Math.sqrt(dx*dx + dy*dy);
	}

	function pointOnLine(t, p0, p1) {
		return point(p0.x + t * (p1.x-p0.x),
					 p0.y + t * (p1.y-p0.y));
	}

	function mouseMove(e) {
		c.width = 600;
		redraw();
		var pos = getMousePos(c, e);

		var t = (pos.x-20)/560;
		if (t < 0) t = 0;
		else if (t > 1) t = 1;
		var curvePoint = bezierFunc(controlPoints,t);

		for (var i = 0; i < controlPoints.length; i++) {
			if (pointDist(pos, controlPoints[i]) < 8) {
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
			var p0 = pointOnLine(t,controlPoints[0],controlPoints[1]);
			var p1 = pointOnLine(t,controlPoints[1],controlPoints[2]);
			var p2 = pointOnLine(t,controlPoints[2],controlPoints[3]);
			var p3 = pointOnLine(t,p0,p1);
			var p4 = pointOnLine(t,p1,p2);
			ctx.strokeStyle = "#b22";
			lineSegment(p0,p1,ctx);
			lineSegment(p1,p2,ctx);
			circlePoint(p0,ctx);
			circlePoint(p1,ctx);
			circlePoint(p2,ctx);
			ctx.strokeStyle = "#22b";
			circlePoint(p3,ctx);
			circlePoint(p4,ctx);
			circlePoint(curvePoint,ctx);
			lineSegment(p3,p4,ctx);
		}
	}

	function mouseDown(e) {
		var pos = getMousePos(c,e);
		for (var i = 0; i < controlPoints.length; i++) {
			if (pointDist(pos, controlPoints[i]) < 8) {
				document.body.style.cursor = "pointer";
				dragging = true;
				dragPoint = controlPoints[i];
				break;
			}
		}
	}
	
	function pointDist(p0,p1) {
		var x = p0.x - p1.x;
		var y = p0.y - p1.y;
		return Math.sqrt(x*x + y*y);
	}
	
	function mouseUp(e) {
		dragging = false;
	}
	
	
	var c = document.getElementById("cubicBezier");
	c.addEventListener("mousemove", mouseMove);
	c.addEventListener("mouseup", mouseUp);
	c.addEventListener("mousedown", mouseDown);
	ctx = c.getContext("2d");
	ctx.strokeStyle = "#000";
	redraw();
}())