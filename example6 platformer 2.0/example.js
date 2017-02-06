
var game = (function() {

    /* do not touch
     */
    var engine    = null;
    var platforms = null;
    var canvas    = null;
    var context   = null;
    var player    = null;
    var rocks     = [];
    var boxes     = [];
    var box_texture = null;
    var rock_texture = null;
    var player_texture = null;

    var sprites = {
        RUNNING : 0,
        REPOSE  : 1,
        FALLING : 2,
        current : 1,
        player  : [],
        last_dir : "right",
    }

    /* do not touch neither
     */
    var texture_loaded = 0;
    var total_textures = 3;
    var box_size =  32;
    var rows = 15;
    var cols = 20;

    var controls = {
        right : false,
        left  : false,
        jump  : false,
        is_jump_enabled : false,
        thunder : false,
        is_thunder_enabled : true,
    };

    var debug_information = {
        contact_points : [],
        platforms : [],
    }

    var map = [
                [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [ 0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0 ],
                [ 0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1,1,0,0 ],
                [ 0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0 ],
                [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [ 0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0 ],
                [ 0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0 ],
                [ 0,2,2,2,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0 ],
                [ 0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0 ],
                [ 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0 ],
                [ 0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0 ],
                [ 0,0,3,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0 ],
                [ 0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,0,0 ],
                [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1 ],
    ];
  
    function isTouchingGround(activeContacts)
    {
        for(var c = 0; c < activeContacts.length; c++)
        {
            if(activeContacts[c].vertex.y < player.position.y)
                return false;
        }
        return true;
    } 

    function onCollisionStart(event)
    {
        var pairs = event.pairs;

        // change object colours to show those starting a collision
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if(pair.bodyA.id == player.id)
            {
                debug_information.contact_points = [];
                for(var c = 0; c < pair.activeContacts.length; c++)
                {
                    debug_information.contact_points.push(pair.activeContacts[c].vertex);
                }
                
                if(isTouchingGround(pair.activeContacts))
                {
                    controls.is_jump_enabled = true;
                    sprites.current = sprites.REPOSE;
                }
            }
        }
    }

    function addPlayer(i, j)
    {
        player = Matter.Bodies.rectangle(
            i * box_size + (box_size >> 1),
            j * box_size + (box_size >> 1),
            30,
            30,
            { isStatic: false,  friction: 0.0, inertia: Infinity }
        );
    }

    function addBox(i, j)
    {
        boxes.push(Matter.Bodies.rectangle(
            i * box_size + (box_size >> 1),
            j * box_size + (box_size >> 1),
            box_size,
            box_size,
            { isStatic: false,  friction: 1.0, label: "box" }
        ));
    }

    function addPlatforms(platforms)
    {
        debug_information.platforms = platforms;
        for(var i = 0; i < platforms.length; i++)
        {
            var aux = Matter.Bodies.fromVertices(0,0,platforms[i], {isStatic : true}, true);
            rocks.push(Matter.Bodies.fromVertices(
                -aux.bounds.min.x + platforms[i][0].x ,
                -aux.bounds.min.y + platforms[i][0].y ,
                platforms[i], {isStatic : true, label: "rock"}, true)
            );
        }
    }

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
        Sprite.init(canvas, context);

        sprites.player.push(new Sprite({
            filename : "http://oi67.tinypic.com/2luoo7.jpg",
            fps      : 20,
            frame_count : 4,
        }));

        sprites.player.push(new Sprite({
            filename : "http://oi67.tinypic.com/avr3x4.jpg",
            fps      : 2,
            frame_count : 2,
        }));

        sprites.player.push(new Sprite({
            filename : "http://oi67.tinypic.com/2luoo7.jpg",
            fps      : 20,
            x_offset : (399) * 2,
            width    : 399,
            frame_count : 1,
        }));

        engine = Matter.Engine.create();
        for(var i = 0; i < cols; i ++)
        {
            for(var j = 0; j < rows; j ++)
            {
                var type = map[j][i];

                switch(type)
                {
                    case 2: addBox(i,j); break;
                    case 3: addPlayer(i,j); break;
                }
            }
        }

        PlatformBuilder.init(map, rows, cols, box_size);
        addPlatforms(PlatformBuilder.build());

        Matter.World.add(engine.world, rocks);
        Matter.World.add(engine.world, boxes);
        Matter.World.add(engine.world, [player]);
        window.addEventListener("keydown", function(e){
            handleKeyEvent(e.keyCode, true);
        });
        window.addEventListener("keyup", function(e){
            handleKeyEvent(e.keyCode, false);
        });
        Matter.Events.on(engine, 'collisionStart', onCollisionStart);
        Matter.Engine.run(engine);
        ThunderEffectManager.init({
            canvas : canvas,
            context : context,
            fps : 30,
            ttl : 1000,
            deviation : 50,
            joint_count : 10, 
            player : player,
        });        
        requestAnimationFrame(update);
    }

    function handleKeyEvent(key, value)
    {
        switch(key)
        {
            case 65 : controls.left = value; break;
            case 68 : controls.right = value; break;
            case 87 : controls.jump = value; break;
            case 32 : controls.thunder = value; break;
        }
    }

    function update()
    {
        if(controls.right)
        {
            Matter.Body.setVelocity(player, { x : 2, y : player.velocity.y } );
            //Matter.Body.translate(player, {x: 2, y: 0});
            if(sprites.current != sprites.FALLING)
                sprites.current = sprites.RUNNING;

            sprites.last_dir = "right";
        }
        else if(controls.left)
        {
            Matter.Body.setVelocity(player, { x : -2, y : player.velocity.y } );
            //Matter.Body.translate(player, {x: -2, y: 0});
            if(sprites.current != sprites.FALLING)
                 sprites.current = sprites.RUNNING;
             sprites.last_dir = "left";
        }
        else
        {
            if(sprites.current != sprites.FALLING)
                sprites.current = sprites.REPOSE;
            Matter.Body.setVelocity(player, { x : 0, y : player.velocity.y } );
        }
        if(controls.jump && controls.is_jump_enabled)
        {
            controls.is_jump_enabled = false;
            Matter.Body.setVelocity(player, { x : player.velocity.x , y : -8} );
        }
        if(controls.thunder && controls.is_thunder_enabled)
        {
            controls.is_thunder_enabled = false;
            ThunderShock();
            setTimeout(function(){
                controls.is_thunder_enabled = true;
            },1000);
        }        
        if(Math.abs(player.velocity.y) > 3)
        {
            sprites.current = sprites.FALLING;
        }
        render();
        requestAnimationFrame(update);
    }

    function getThunderContactPoint(x)
    {
        var x_coord = (x / box_size)|0;
        for(var i = 0; i < rows; i++)
        {
            if(map[i][x_coord] == 1) // 1 means rock
            {
                return i * box_size;
            }
        }
        return rows * box_size;
    }

    function ThunderShock()
    {
            var thunder_x = player.position.x;
            var thunder_y = getThunderContactPoint(player.position.x);

            var bodies = Matter.Composite.allBodies(engine.world);
            var collisions = Matter.Query.ray(bodies, { x: thunder_x + 10, y : 0 }, { x: thunder_x + 10, y : thunder_y }, box_size * 3);

            for(var i = 0; i < collisions.length; i++)
            {
                if(collisions[i].body.label == "box" && collisions[i].body.position.y < thunder_y)
                {
                    var force = {
                        x : (collisions[i].body.position.x - thunder_x) * 0.0002,
                        y : -0.04
                    };
                    Matter.Body.applyForce(collisions[i].body, collisions[i].body.position, force);
                }
            }

            ThunderEffectManager.addThunder(thunder_x, thunder_y);
    }

    function render()
    {
        context.clearRect(0,0, canvas.width, canvas.height);
        context.save();
        var camera_translation = -(player.position.x|0) + (canvas.width>>1);
        context.translate(camera_translation, 0);

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
        context.restore();
        if(sprites.current == sprites.RUNNING || sprites.current == sprites.FALLING)
        {
            sprites.player[sprites.current].render(player.position.x -25, player.position.y - 15, 50, 30, sprites.last_dir != "right");
        }
        else
        {
            sprites.player[sprites.current].render(player.position.x -20, player.position.y - 20, 40, 40, sprites.last_dir != "right");
        }
        ThunderEffectManager.draw();
        debug_render(debug_information.platforms);
        context.restore();
    }

    function debug_render(platforms)
    {
        return;
        context.save();
        for(var p = 0; p < platforms.length; p++)
        {
            var platform = platforms[p];
            var v = 0;
            context.lineWidth = 5;
            context.strokeStyle = "#ff0000";
            context.beginPath();
            context.moveTo(platform[0].x,platform[0].y);
            for(v = 0; v < platform.length; v++)
            {
                context.lineTo(platform[v].x,platform[v].y);
            }
            context.closePath();
            context.stroke();
        }
        context.restore();
        context.save();
        context.fillStyle = "white";
        for(var c = 0; c < debug_information.contact_points.length; c++)
            context.fillRect(debug_information.contact_points[c].x-2,debug_information.contact_points[c].y-2,5,5);
        context.restore();
    }

    return { init           : init,
             handleKeyEvent : handleKeyEvent };
})();