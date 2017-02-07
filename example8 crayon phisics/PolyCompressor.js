

var PolyCompressor = (function(){

	var min_angle = 0;
	var min_distance = 0;
	var polygon;

	function compress(_polygon)
	{
		polygon = _polygon;
        if(polygon.length < 3)
        	return polygon;
        var i, l = polygon.length;
        for(i = 0; i < l; i++)
        {
        	var a = getAngle(i);
            if(a < min_angle)
            {
            	console.log("angulo menor al permitido: " + a);
            }
        }

	}

	function getAngle(vertex_index)
	{
        if(vertex_index == 0 || vertex_index == polygon.length-1)
        {
        	return min_angle + 1;
        }

        
	}

	function getDistance(vertex_index)
	{

	}

	return { compress : compress };

})();