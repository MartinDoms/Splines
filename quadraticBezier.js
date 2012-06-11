(function() {

	function quadraticBezier(points, t) {
		var p0 = points[0];
		var p1 = points[1];
		var p2 = points[2];
		var t3 = t*t*t;
		var t2 = t*t;

		var dx = dot([p0.x, p1.x, p2.x], [(1-t)*(1-t), 2*t*(1-t), t2]);
		var dy = dot([p0.y, p1.y, p2.y], [(1-t)*(1-t), 2*t*(1-t), t2]);

		return point(dx,dy);
	}
	
	function drawGuideLines(t, controlPoints, ctx) {				
		var p0 = pointOnLine(t,controlPoints[0],controlPoints[1]);
		var p1 = pointOnLine(t,controlPoints[1],controlPoints[2]);
		ctx.strokeStyle = "#b22";
		lineSegment(p0,p1,ctx);
		circlePoint(p0,ctx);
		circlePoint(p1,ctx);
		circlePoint(quadraticBezier(controlPoints, t),ctx);
	}

	var controlPoints = [point(60,190),point(260,10),point(550,120)];
	var c = document.getElementById("quadraticBezier");
	var curveCanvas = new CurveCanvas(c, controlPoints, quadraticBezier, drawGuideLines);
	
}());