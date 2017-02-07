
var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

var CrayonPhysics = (function(){

  var canvas;
  var context;
  var img_crayon;
  var img_background;
  var crayon_pos;
  var engine;
  var bodies = [];
  var current_polygon = [];
  var ground_info;
  var ground;

  function init(options)
  {
      canvas = options.canvas;
      context = options.context;
      crayon = new Image();
      background = new Image();
      crayon.src = "http://icons.iconarchive.com/icons/designcontest/vintage/256/Crayon-icon.png";
      background.src = "http://www.powerpointhintergrund.com/uploads/notebook-ppt-background-2.jpg";
      crayon_pos = { x : 0, y : 0 };
      canvas.addEventListener("mousemove", function(e) {
          crayon_pos.x =  e.clientX - 5;
          crayon_pos.y =  e.clientY - 95;
      });      
      engine = Matter.Engine.create();
      Matter.Engine.run(engine);
      ground_info = {
          x: 320, y: 455,
          width: 640, height: 50,
      };
      ground = Matter.Bodies.rectangle(
          ground_info.x,
          ground_info.y,
          ground_info.width,
          ground_info.height,
          { isStatic : true }
      )
      Matter.World.add(engine.world, [ground]);
      Touch.surface("canvas", onTouchEvent);
      window.requestAnimationFrame(render);
  }

  function render()
  {
      // clearing the screen
      context.clearRect(0,0, canvas.width, canvas.height);

      // drawing the background
      context.drawImage(background,0,0, canvas.width, canvas.height);

      // drawing the current polygon
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

      // drawing the floor
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

      // drawing polygons
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
          context.lineWidth = 5;
          context.stroke();
          context.restore();
      }

      // drawing the cursor
      context.drawImage(crayon, crayon_pos.x, crayon_pos.y, 100,100);
      window.requestAnimationFrame(render);
  }

  function onTouchEvent(e)
  {
      if(e.type == "touchmove")
      {
           current_polygon.push({
               x : e.x,
               y : e.y,
           });
      }    
      else if(e.type == "touchend")
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
  }

  return { init : init };

})();

CrayonPhysics.init({
  canvas : canvas,
  context : context,
});