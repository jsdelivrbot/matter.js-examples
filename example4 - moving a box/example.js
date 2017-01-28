
var texture = new Image();
texture.src = "http://opengameart.org/sites/default/files/styles/medium/public/RTS_Crate_0.png";

var ground_texture = new Image();
ground_texture.src = "https://s-media-cache-ak0.pinimg.com/originals/a2/69/6a/a2696a38e19a9f79b7890c0aa3de1d7e.jpg";

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

// module aliases
var Engine = Matter.Engine,
    Composite = Matter.Composite,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

var pattern = "pink";
ground_texture.onload = function() {
    pattern = context.createPattern(ground_texture, "repeat");
}

var right = false;

window.addEventListener("keydown", function(){
    right = true;
});

window.addEventListener("keyup", function(){
    right = false;
});

function update()
{
    // run the engine
    if(right)
    {
        boxA.position.x += 2;
        boxA.position.y -= 1;
    }
    Engine.update(engine, 15);
    render();
    window.requestAnimationFrame(update);
}

function render()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
    // drawing boxA
    context.save();
      context.translate(boxA.position.x, boxA.position.y);
      context.rotate(boxA.angle);
      context.drawImage(texture, -40, -40, 80, 80);
    context.restore();

    // drawing boxB
    context.save();
      context.translate(boxB.position.x, boxB.position.y);
      context.rotate(boxB.angle);
      context.drawImage(texture, -40, -40, 80, 80);
    context.restore();

    // drawing ground
    context.save();
      context.fillStyle = pattern;
      context.translate(ground.position.x, ground.position.y);
      context.rotate(ground.angle);
      context.fillRect(-405, -30, 810, 60);
    context.restore();
}

window.requestAnimationFrame(update);