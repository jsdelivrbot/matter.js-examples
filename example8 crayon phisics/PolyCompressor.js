

var PolyCompressor = (function(){

    var invalid_dot_product = -1.0;
    var umbral = 0.2;
	var polygon;

	function compress(_polygon)
	{
		polygon = _polygon;
        if(polygon.length < 3)
        	return polygon;
        var i, l = polygon.length;
        for(i = 0; i < l; i++)
        {
        	var dp = evaluate(i);
            if(Math.abs(dp - invalid_dot_product) < umbral)
            {
            	polygon[i].enabled = false;
            }
            else
            {
            	polygon[i].enabled = true;
            }
        }

        var res = [];
        for(var i = 0; i < polygon.length; i++)
        {
        	if(polygon[i].enabled)
        	{
        	    res.push({
        	        x : polygon[i].x,
        	        y : polygon[i].y
        	    });
        	}
        }
        return res;
	}

	function evaluate(vertex_index)
	{
        if(vertex_index == 0 || vertex_index == polygon.length-1)
        {
        	return 0;
        }
        var vec1 = sub(polygon[vertex_index-1],polygon[vertex_index]);
        var vec2 = sub(polygon[vertex_index+1],polygon[vertex_index]);
        return dot(normalize(vec1), normalize(vec2));
	}

	function sub(vec1, vec2)
	{
		return {
            x : vec1.x -  vec2.x,
            y : vec1.y -  vec2.y
		};
	}

	function normalize(vec)
	{
        var length = Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
        return {
            x : vec.x / length,
            y : vec.y / length
        };
	}

	function dot(vec1, vec2)
	{
		return vec1.y * vec2.x + vec1.y * vec2.y;
	}

	return { compress : compress };

})();
