
var box_info = {
    x : 500, y : 100,
    width: 100, height: 100,
};

var box2_info = {
    x : 150, y : 100,
    width: 20, height: 20,
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

var box = Matter.Bodies.rectangle( 
	box_info.x,
	box_info.y,
	box_info.width,
	box_info.height,
	{isStatic: false}
);

var box2 = Matter.Bodies.rectangle( 
	box2_info.x,
	box2_info.y,
	box2_info.width,
	box2_info.height,
	{isStatic: false}
);

Matter.World.add(engine.world, [
	catapult,
	ground,
	box,
	box2,
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

    // Box 1
	context.save();
	context.fillStyle = "pink";
	context.translate(box.position.x, box.position.y);
	context.rotate(box.angle);;
	context.fillRect(
		-box_info.width>>1,
		-box_info.height>>1,
		box_info.width,
		box_info.height
	);
	context.restore();		

    // Box 2
	context.save();
	context.fillStyle = "pink";
	context.translate(box2.position.x, box2.position.y);
	context.rotate(box2.angle);;
	context.fillRect(
		-box2_info.width>>1,
		-box2_info.height>>1,
		box2_info.width,
		box2_info.height
	);
	context.restore();	

    window.requestAnimationFrame(render);
}

Matter.Engine.run(engine);
window.requestAnimationFrame(render);