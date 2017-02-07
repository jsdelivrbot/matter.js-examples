
var circle_info = {
    x : 500, y : 100,
    radio: 100,
};

var circle2_info = {
    x : 150, y : 100,
    radio: 20,
};

var catapult_info = {
    x : 320, y : 500,
    width: 400, height: 20,
};

var ground_info = {
    x : 320, y : 590,
    width: 640, height:20,
};


var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
var engine = Matter.Engine.create();

var catapult = Matter.Bodies.rectangle( 
	catapult_info.x,
	catapult_info.y,
	catapult_info.width,
	catapult_info.height,
	{isStatic: false}
);

var ground = Matter.Bodies.rectangle( 
	ground_info.x,
	ground_info.y,
	ground_info.width,
	ground_info.height,
	{isStatic: true}
);

var circle = Matter.Bodies.circle( 
	circle_info.x,
	circle_info.y,
	circle_info.radio,
	{isStatic: false}
);

var circle2 = Matter.Bodies.circle( 
	circle2_info.x,
	circle2_info.y,
	circle2_info.radio,
	{isStatic: false}
);

Matter.World.add(engine.world, [
	catapult,
	ground,
	circle,
	circle2,
	Matter.Constraint.create({ bodyA: catapult, pointB: { x: 300, y: 590 } }),
	Matter.Constraint.create({ bodyA: catapult, pointB: { x: 320, y: 590 } }),
    Matter.Constraint.create({ bodyA: catapult, pointB: { x: 340, y: 590 } })
]);

function render()
{
	context.clearRect(0, 0, canvas.width, canvas.height);

	// catapulta
	context.save();
	context.fillStyle = "pink";
	context.translate(catapult.position.x, catapult.position.y);
	context.rotate(catapult.angle);;
	context.fillRect(
		-catapult_info.width>>1,
		-catapult_info.height>>1,
		catapult_info.width,
		catapult_info.height
	);
	context.restore();

    // suelo
	context.save();
	context.fillStyle = "pink";
	context.translate(ground.position.x, ground.position.y);
	context.rotate(ground.angle);;
	context.fillRect(
		-ground_info.width>>1,
		-ground_info.height>>1,
		ground_info.width,
		ground_info.height
	);
	context.restore();	

    // circle 1
	context.save();
	context.fillStyle = "pink";
	context.translate(circle.position.x, circle.position.y);
	context.rotate(circle.angle);;
	context.beginPath();
	context.arc(
		0,0,
		circle_info.radio,
		0, 2 * Math.PI
	);
	context.fill();
	context.restore();		

    // circle 2
	context.save();
	context.fillStyle = "pink";
	context.translate(circle2.position.x, circle2.position.y);
	context.rotate(circle2.angle);;
	context.beginPath();
	context.arc(
		0,0,
		circle2_info.radio,
		0, 2 * Math.PI
	);
	context.fill();
	context.restore();	

    window.requestAnimationFrame(render);
}

Matter.Engine.run(engine);
window.requestAnimationFrame(render);