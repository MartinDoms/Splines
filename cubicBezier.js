(function() {

	function cubicBezier(points, t) {
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
	
	function drawGuideLines(t, controlPoints, ctx) {
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
		circlePoint(cubicBezier(controlPoints, t),ctx);
		lineSegment(p3,p4,ctx);
	}

	var controlPoints = [point(60,190),point(120,10),point(500,10),point(520,190)];
	var c = document.getElementById("cubicBezier");
	var curveCanvas = new CurveCanvas(c, controlPoints, cubicBezier, drawGuideLines);
	
}());
