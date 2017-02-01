
// PlatformBuilder
// utiliza la tecnica del pequeño robot que si pudo

var PlatformBuilder = (function(){

	var map, rows, cols, box_size;
	var flag_map;

    var island = [];

    var UP    = 0;
    var RIGHT = 1;
    var DOWN  = 2;
    var LEFT  = 3;

    var displacement_vectors = [
        { x : 0, y : -1 }, // UP
        { x : 1, y : 0 },  // RIGHT
        { x : 0, y : 1 },  // DOWN
        { x : -1, y : 0 },  // LEFT
    ];

    current_direction = UP;
    next_direction = RIGHT;

    var robot_position = { x : 0 , y : 0 };

    function stepDirection()
    {
        current_direction++;
        next_direction++;
        if(current_direction > LEFT)
            current_direction = UP;
        if(next_direction > LEFT)
            next_direction = UP;
    }

    function i_stepDirection()
    {
        current_direction--;
        next_direction--;
        if(current_direction < UP)
            current_direction = LEFT;
        if(next_direction  < UP)
            next_direction = LEFT;
    }

    function getVerticesAtPos(x , y)
    {
        return[
            { x : x * (box_size)  + box_size , y : y * box_size},
            { x : x * (box_size)  + box_size , y : (y * box_size) + box_size },
            { x : x * box_size, y : (y * box_size) + box_size },
            { x : x * box_size, y : y * box_size }
        ];
    }

    function canRotate()
    {
        var x = robot_position.x + displacement_vectors[next_direction].x;
        var y = robot_position.y + displacement_vectors[next_direction].y;
        if(x < 0 || y < 0 || x >= cols || y >= rows || map[y][x] != 1)
            return true;
        return false;
    }

    function canWalk()
    {
        var x = robot_position.x + displacement_vectors[current_direction].x;
        var y = robot_position.y + displacement_vectors[current_direction].y;
        if(x < 0 || y < 0 || x >= cols || y >= rows || map[y][x] != 1)
            return true;
        return false;
    }

    function walk()
    {
        robot_position.x += displacement_vectors[current_direction].x;
        robot_position.y += displacement_vectors[current_direction].y;
    }

	function init(_map, _rows, _cols, _box_size)
	{
        map = _map;
        rows = _rows;
        cols = _cols;
        box_size = _box_size;
        flag_map = [];
        for(var i = 0; i < rows; i++)
        {
        	flag_map.push([]);
        	for(var j = 0; j < cols; j++)
        	{
                flag_map[i].push(0);
        	}
        }
        if(flag_map.length != map.length)
        {
        	console.error("ERROR building flag_map");
        }
	}

	function build()
	{
		var platforms = [];
        for(var i = 0; i < rows; i++)
        {
            for(var j = 0; j < cols; j++)
            {
                if(map[i][j] == 1 && flag_map[i][j] == 0)
                {
                    var pl = buildSinglePlatform(j,i);
                    if(pl != undefined)
                    {
                        platforms.push(pl);
                    }
                }
            }
        }

        if(platforms.length > 0)
            return platforms;

        return [[
            { x : 0, y : 0 },
            { x : 32, y : 0 },
            { x : 32, y : 32 },
            { x : 0, y : 32 },
        ]];
	}

    function buildSinglePlatform(x, y)
    {
        burnIsland(x,y);
        robot_position.x = x - 1;
        robot_position.y = y;
        current_direction = UP;
        next_direction = RIGHT;
        var res = [];
        walk();
        while(robot_position.x != (x-1) || robot_position.y != y)
        {
            if(canRotate())
            {
                res.push(getVerticesAtPos(robot_position.x, robot_position.y)[next_direction]);
                stepDirection();
                walk();
            }

            if(!canWalk())
            {
                res.push(getVerticesAtPos(robot_position.x, robot_position.y)[current_direction]);
                i_stepDirection();
            }
            
            walk();
        }
        return res;
    }

    // SPOILER ALERT!
    //     this is a filling algorithm
    function burnIsland(x, y)
    {
        if(x < 0 || y < 0 || x >= cols || y >= rows || map[y][x] != 1 || flag_map[y][x] != 0)
            return;

        flag_map[y][x] = 1;

        burnIsland(x, y - 1);
        burnIsland(x + 1, y);
        burnIsland(x, y + 1);
        burnIsland(x - 1, y);
    }

	return { init : init, build : build };

})();