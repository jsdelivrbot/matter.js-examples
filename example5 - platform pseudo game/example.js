

var game = (function() {

	var engine = null;

	var canvas = null;
	var context = null;

	var box_texture = null;
	var rock_texture = null;
	var player_texture = null;
	var texture_loaded = 0;
	var total_textures = 3;

	var controls = {
		right : false,
		left  : false,
		jump  : false,
		is_jump_enabled : true,
	};

	var player = null;
	var rocks  = [];
	var boxes  = [];

	var box_size =  32;

	var map = [
	    [ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1 ],
	    [ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1 ],
	    [ 1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1 ],
	    [ 1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,2,0,1 ],
	    [ 1,0,2,0,0,1,1,0,0,0,0,2,2,0,0,0,2,2,0,1 ],
	    [ 1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1 ],
	    [ 1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1 ],
	    [ 1,1,1,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,1,1 ],
	    [ 1,1,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1 ],
	    [ 1,0,0,0,0,0,0,2,0,0,0,2,2,0,0,0,0,0,0,1 ],
	    [ 1,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1,1,1,1,1 ],
	    [ 1,0,0,0,0,1,1,1,1,0,0,2,2,0,0,0,0,0,0,1 ],
	    [ 1,0,3,0,0,1,1,1,1,0,0,2,2,0,0,0,0,0,0,1 ],
	    [ 1,0,0,0,2,1,1,1,1,0,0,0,2,0,0,0,0,0,0,1 ],
	    [ 1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1 ],
	];

	var rows = 15, cols = 20;

	function init(container_selector)
	{
		box_texture = new Image();
		box_texture.src = "http://opengameart.org/sites/default/files/styles/medium/public/RTS_Crate_0.png";
		rock_texture = new Image();
		rock_texture.src = "http://hasgraphics.com/wp-content/uploads/2010/07/basic_ground_tileset.png";
		player_texture = new Image();
		player_texture.src = "http://cdn.wikimg.net/strategywiki/images/c/cc/Contra_NES_sprite_player1.png";

        var div = document.querySelector(container_selector);
        canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 480;
        div.appendChild(canvas);
        context = canvas.getContext("2d");

        engine = Matter.Engine.create();

        for(var i = 0; i < cols; i ++)
        {
            for(var j = 0; j < rows; j ++)
            {
            	var type = map[j][i];
            	var isStatic = type == 1;
            	if(type != 0)
            	{
                     var obj = Matter.Bodies.rectangle(
                     	i * box_size + (box_size >> 1),
                     	j * box_size + (box_size >> 1),
                     	box_size,
                     	box_size,
                     	{ isStatic: isStatic }
                     );
                     switch(type)
                     {
                     	case 1 : rocks.push(obj); break;
                     	case 2 : boxes.push(obj); break;
                     	case 3 : player = obj;
                     	         Matter.Body.setInertia(obj, Infinity);
                     	         break;
                     }
            	}
            }
        }

        Matter.World.add(engine.world, rocks);
        Matter.World.add(engine.world, boxes);
        Matter.World.add(engine.world, [player]);

        window.addEventListener("keydown", function(e){
        	handleKeyEvent(e.keyCode, true);
        });

        window.addEventListener("keyup", function(e){
        	handleKeyEvent(e.keyCode, false);
        });

        Matter.Engine.run(engine);
        requestAnimationFrame(update);
	}

	function handleKeyEvent(key, value)
	{
		switch(key)
		{
			case 65 : controls.left = value; break;
			case 68 : controls.right = value; break;
			case 87 : controls.jump = value; break;
		}
	}

	function update()
	{
		if(controls.right)
		{
			Matter.Body.setVelocity(player, { x : 2, y : player.velocity.y } );
			//Matter.Body.translate(player, {x: 2, y: 0});
		}
		else if(controls.left)
		{
            Matter.Body.setVelocity(player, { x : -2, y : player.velocity.y } );
            //Matter.Body.translate(player, {x: -2, y: 0});
		}
        if(controls.jump && controls.is_jump_enabled)
        {
            controls.is_jump_enabled = false;
            Matter.Body.setVelocity(player, { x : player.velocity.x , y : -8} );
            setTimeout(function(){
              controls.is_jump_enabled = true;
            }, 500);
        }
        //Matter.Body.rotate(player, -player.angle);
		//Matter.Engine.update(engine, 15);
        render();
        requestAnimationFrame(update);
	}

	function render()
	{
        context.clearRect(0,0, canvas.width, canvas.height);

        for(var i = 0; i < cols; i++)
        {
        	for(var j = 0; j < rows; j++)
        	{
        		if(map[j][i] == 1)
        		{
        			var x = i * box_size;
        			var y = j * box_size;
        			var grass = (map[Math.max(j-1,0)][i] == 1);
        			context.save();
                    context.translate(x, y);
                    if(grass)
                    	context.drawImage(rock_texture,25, 76, 50, 49, 0 , 0, box_size, box_size ); 
                    else
                    	context.drawImage(rock_texture,25, 15, 50, 50, 0 , 0, box_size, box_size );
                    context.restore();
        		}
        	}
        }


        //var i = 0;
        //var l = rocks.length;
        //for(i = 0; i < l; i++)
        //{
        //	var r = rocks[i];
        //    context.save();
        //    context.translate(r.position.x, r.position.y);
        //    context.rotate(r.angle);
        //    //context.drawImage(rock_texture,25, 15, 50, 50, (-box_size>>1) , (-box_size>>1), box_size, box_size );
        //    context.drawImage(rock_texture,25, 76, 50, 49, (-box_size>>1) , (-box_size>>1), box_size, box_size );
        //    context.restore();
        //}

        var l = boxes.length;
        for(i = 0; i < l; i++)
        {
        	var b = boxes[i];
            context.save();
            context.translate(b.position.x, b.position.y);
            context.rotate(b.angle);
            context.drawImage(box_texture, (-box_size>>1) , (-box_size>>1), box_size, box_size );
            context.restore();
        }

        context.save();
        context.translate(player.position.x, player.position.y);
        context.rotate(player.angle);
        context.drawImage(player_texture, (-box_size>>1) , (-box_size>>1), box_size, box_size );
        context.restore();
	}

    return { init           : init,
    	     handleKeyEvent : handleKeyEvent };
})();