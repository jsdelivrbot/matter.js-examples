

var ThunderEffectManager = (function(){

	var canvas;
	var context;
	var fps;
	var deviation;
	var joint_count;
	var ttl;
	var frame_time_limit;

	var thunders = [];

    function init(options)
    {
    	// configuration options
        canvas = options.canvas;
        context = options.context;
        fps = options.fps;
        ttl = options.ttl;
        deviation = options.deviation;
        joint_count = options.joint_count;

        // -------------------------------
        frame_time_limit = 1 / fps * 1000;
    }

    function addThunder(x, y)
    {
    	var creation_time = new Date().getTime();
        thunders.push({
        	deviation : deviation,
        	joint_count : joint_count,
        	creation_time    : creation_time,
        	polygon          : generateThunderPolygon(x, -10, x, y, deviation, joint_count),
        	frame_time_stamp : creation_time,
        });
        thunders.push({
        	deviation : deviation/2,
        	joint_count : joint_count/2, 
        	creation_time    : creation_time,
        	polygon          : generateThunderPolygon(x, -10, x, y, deviation/2, joint_count/2),
        	frame_time_stamp : creation_time,
        });
        thunders.push({
        	deviation : deviation/2,
        	joint_count : joint_count/2, 
        	creation_time    : creation_time,
        	polygon          : generateThunderPolygon(x, -10, x, y, deviation/2, joint_count/2),
        	frame_time_stamp : creation_time,
        });
    }

    function draw()
    {
    	var current_time = new Date().getTime();
    	var i , l = thunders.length;
        for(i = 0; i < l; i++)
        {
            if(current_time - thunders[i].creation_time < ttl )
            {
                drawRay(thunders[i].polygon, 20, 0., "#ffff00");
                drawRay(thunders[i].polygon, 8, 0.3, "#ffff00");
                drawRay(thunders[i].polygon, 1, 1, "#ffffff");
                if(current_time - thunders[i].frame_time_stamp > frame_time_limit)
                {
                	thunders[i].polygon = generateThunderPolygon (
                		thunders[i].polygon[0].x,
                		-50,
                		thunders[i].polygon[0].x,
                		thunders[i].polygon[thunders[i].polygon.length - 1].y, thunders[i].deviation, thunders[i].joint_count
                	);
                	thunders[i].frame_time_stamp = current_time; 
                }
            }
        }
    }

    function drawRay(ray, width, alpha, color)
    {
        context.save();
        context.strokeStyle = color;
        context.lineWidth =  width;
        context.globalAlpha = alpha;    
        context.beginPath();
        context.moveTo(ray[0].x,ray[0].y);
        for(var i = 1; i < ray.length; i++)
        {
            context.lineTo(ray[i].x,ray[i].y);
        }
        context.stroke();
        context.closePath();
        context.restore();
    }

    function generateThunderPolygon(x1, y1, x2, y2, deviation, joint_count)
    {
        var polygon = [];
        var y_step = (y2 - y1)/joint_count;
        polygon.push({ x : x1, y : y1 });
        for(var i = y_step; i < y2; i+= y_step)
        {
            var disp =  Math.floor((Math.random() * (deviation<<1)));
            polygon.push({ x : x1 + disp - deviation, y : i });
        }
        polygon.push({ x : x2 , y : y2 });
        return polygon;
    }

    return { init : init,
             draw : draw,
             addThunder : addThunder };
	
})();