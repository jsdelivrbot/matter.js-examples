

var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

var engine = Matter.Engine.create();
Matter.Engine.run(engine);
var bodies = [];
var current_polygon = [];

var ground_info = {
    x: 320, y: 455,
    width: 640, height: 50,
};

var ground = Matter.Bodies.rectangle(
	ground_info.x,
	ground_info.y,
	ground_info.width,
	ground_info.height,
	{ isStatic : true }
);

Matter.World.add(engine.world, [ground]);

function render()
{
    context.clearRect(0,0, canvas.width, canvas.height);

    context.save();
    if(current_polygon.length > 1)
    {
        context.strokeStyle = "black";
        context.lineWidth = 5;
        context.beginPath();
        context.moveTo(current_polygon[0].x, current_polygon[0].y);
        for(var i = 0; i < current_polygon.length; i++)
        {
        	context.lineTo(current_polygon[i].x, current_polygon[i].y);
        }
        context.stroke();
    }
    context.restore();
   
    //context.save();
    //var bodies2 = Matter.Composite.allBodies(engine.world);
    //context.beginPath();
    //for (var i = 0; i < bodies2.length; i += 1) {
    //    var vertices = bodies2[i].vertices;
    //    context.moveTo(vertices[0].x, vertices[0].y);
    //    for (var j = 1; j < vertices.length; j += 1) {
    //        context.lineTo(vertices[j].x, vertices[j].y);
    //    }
    //    context.lineTo(vertices[0].x, vertices[0].y);
    //}
    //context.fillStyle = 'black';
    //context.fill();
    //context.restore();

    context.save();
    context.translate(ground.position.x, ground.position.y);
    context.fillStyle = "black";
    context.fillRect(
    	-ground_info.width>>1,
    	-ground_info.height>>1,
    	ground_info.width,
    	ground_info.height
    );
    context.restore();

    var i, l = bodies.length;
    for(i = 0; i < l; i++)
    {
        context.save();
        context.translate(bodies[i].body.position.x, bodies[i].body.position.y);
        context.rotate(bodies[i].body.angle);
        context.translate(-bodies[i].centroid.x, -bodies[i].centroid.y);
        context.fillStyle = "black";
        context.beginPath();
        context.moveTo(bodies[i].vertices[0].x, bodies[i].vertices[0].y);
        for(var j = 1; j < bodies[i].vertices.length; j++)
        {
        	context.lineTo(bodies[i].vertices[j].x, bodies[i].vertices[j].y);
        }
        context.closePath();
        context.fill();
        context.restore();
    }    

    window.requestAnimationFrame(render);
}

Touch.surface("canvas",function(e){

   if(e.type == "touchstart")
   {
       current_polygon = [];
   }
   if(e.type == "touchend")
   {
   	    if(current_polygon.length == 0)
   	    	return;
   	    current_polygon.push({
        	x : current_polygon[0].x,
        	y : current_polygon[0].y,
        });
       var centroid = Matter.Vertices.centre(current_polygon);
       var body = Matter.Bodies.fromVertices(centroid.x, centroid.y, current_polygon);
       if(body == undefined)
       {
       	   current_polygon = [];
           return;
       };
       var diff = {
           x : body.vertices[0].x - current_polygon[0].x,
           y : body.vertices[0].y - current_polygon[0].y,
       };       
       bodies.push({
           body : body,
           vertices : current_polygon,
           centroid: centroid,
       });
       Matter.World.add(engine.world, [body]);
       current_polygon = [];
   }
   else if(e.type == "touchmove")
   {
        current_polygon.push({
        	x : e.x,
        	y : e.y,
        });
   }

});

render();