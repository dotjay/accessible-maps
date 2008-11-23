/*

Accessible Maps
http://scriptingenabed.pbwiki.com/Easy-Google-Maps

Scripting Enabled, September 2008
http://scriptingenabled.org/

Jon Gibbins
Ann McMeekin
Andy Ronksley
Marco Ranon
Samantha Roach
Antonia Hyde
Gilles Ruppert

*/


function addLoadEvent(func)
{
	var oldonload=window.onload;
	if (typeof window.onload!='function') window.onload=func;
	else{
		window.onload=function(){
			oldonload();
			func();
		}
	}
}


// Google Maps

var map;

function getMapElement(id)
{
	var elMap = document.getElementById(id);
	if (!elMap) {
		return false;
	}
	while (elMap.hasChildNodes()) elMap.removeChild(elMap.firstChild);
	return elMap;
}

function getDirections(map, containerId, fromAddress, toAddress) {
	var directions = new GDirections(map, document.getElementById(containerId));
	directions.load("from: " + fromAddress + " to: " + toAddress, { "locale": en_UK });
}

function initMap() {
	setTimeout("if(typeof GMap2!='undefined') loadMap();",10);
}

function loadMap() {
	if (
		!GBrowserIsCompatible()
		|| !(document.createElementNS || document.createElement)
		|| !document.createTextNode
		|| !(typeof mapMarkers == 'object')
		) return false;

	// Try to get the map container
	var elMap = getMapElement("map");

	// Create the map
	map = new GMap2(elMap);
	if (!map) return false;

	// Disable the double click zoom feature. This may help reduce problems for people with tremors, no fine mouse control...
	map.disableDoubleClickZoom();

	// Center the map on default location
	map.setCenter(new GLatLng(mapDefaults.latitude, mapDefaults.longitude), mapDefaults.zoom);
	map.center = map.getCenter();

	// Set up the map
	$('#map')
		.addClass('medium')						// Default map size
		.wrap('<div id="map-enabled">')			// Restructure
		.before('<div id="controls"></div>');	// Controls container

	// If we were doing a typical Google Map implementation, we'd add the controls here.
	// We won't be doing that here, but for a good article on making Google's map controls accessible, see:
	// http://dev.opera.com/articles/view/keyboard-accessible-google-maps/
	//map.addControl(new GLargeMapControl(), new GControlPosition(G_ANCHOR_TOP_LEFT));
	//map.addControl(new GMapTypeControl());

	// Add custom controls
	// Built upon work by Derek Featherstone: http://ironfeathers.ca/routes/

	var up = $('<input type="image" id="up" src="images/up.gif" alt="Up">')
		.click(function(){
			map.panDirection(0, mapDefaults.panning);
		});

	var down = $('<input type="image" id="down" src="images/down.gif" alt="Down">')
		.click(function(){
			map.panDirection(0, - mapDefaults.panning);
		});

	var left = $('<input type="image" id="left" src="images/left.gif" alt="Left">')
		.click(function(){
			map.panDirection(mapDefaults.panning, 0);
		});

	var right = $('<input type="image" id="right" src="images/right.gif" alt="Right">')
		.click(function(){
			map.panDirection(- mapDefaults.panning, 0);
		});

	var centre = $('<input type="image" id="reset" src="images/reset.gif" alt="Reset">')
		.click(function(){
			map.setCenter(map.center, mapDefaults.zoom);
		});

	var zoomin = $('<input type="image" id="zoom-in" src="images/zoom-in.gif" alt="Zoom in">')
		.click(function(){
			map.zoomIn();
		});

	var zoomout = $('<input type="image" id="zoom-out" src="images/zoom-out.gif" alt="Zoom out">')
		.click(function(){
			map.zoomOut();
		});

	var map_control = $('<div>')
		.attr('id','map-control')
		.append('<h2>Move the map</h2>')
		.append(up)
		.append(down)
		.append(left)
		.append(right)
		.append(centre)
		.append(zoomin)
		.append(zoomout);

	var smallmap = $('<input type="image" id="small-map" src="images/small-map.gif" alt="Small map">')
		.click(function(){
			$('#map')
				.addClass('small')
				.removeClass('medium')
				.removeClass('large');
			map.checkResize();
		});

	var mediummap = $('<input type="image" id="medium-map" src="images/medium-map.gif" alt="Medium map">')
		.click(function(){
			$('#map')
				.removeClass('small')
				.addClass('medium')
				.removeClass('large');
			map.checkResize();
		});

	var largemap = $('<input type="image" id="large-map" src="images/large-map.gif" alt="Large map">')
		.click(function(){
			$('#map')
				.removeClass('small')
				.removeClass('medium')
				.addClass('large');
			map.checkResize();
		});

	var map_resize = $('<div>')
		.attr('id','map-resize')
		.append('<h2>Map size</h2>')
		.append(smallmap)
		.append(mediummap)
		.append(largemap);

	// Generate the controls
	$('#controls')
		.append(map_control)
		.append(map_resize);

	// Add markers
	//var mapHtml;
	for (marker in mapMarkers) {
		// Set HTML
		//mapHtml = '<div id="map-overlay"><form method="get" action="http://maps.google.com/maps">';
		//mapHtml += '<p><label for="saddr">Get directions from: </label><input class="text" type="text" id="saddr" name="saddr" value="" /><input type="hidden" name="daddr" value="' + mapMarkers[marker].daddr + '" /><input type="hidden" name="hl" value="en" /><input class="submit" type="submit" value="Go" /></p>';
		//mapHtml += '</form></div>';
		//mapMarkers[marker].html = mapHtml;

		// Set marker position
		mapMarkers[marker].latlng = new GLatLng(parseFloat(mapMarkers[marker].latitude), parseFloat(mapMarkers[marker].longitude));

		// Create and add marker
		mapMarkers[marker].marker = new GMarker(mapMarkers[marker].latlng);
		// Here we flagged the marker ID for some reason. Need to remember why and refactor.
		//mapMarkers[marker].marker.value = i;
		map.addOverlay(mapMarkers[marker].marker);
	};

	// Now that the map has size, etc. redraw and centre.
	map.checkResize();
	map.setCenter(map.center, mapDefaults.zoom);

	return true;
}


// Add load and unload events.
addLoadEvent(initMap);
window.onunload = function() {
	if (typeof GUnload != 'undefined') GUnload();
}
