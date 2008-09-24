/*

Accessible Maps

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


// Settings

var defaults = Array();
defaults["latitude"] = "51.528386";
defaults["longitude"] = "-0.078184";
defaults["zoom"] = 15;
defaults["panAmount"] = 1;
defaults["directions_label"] = 'Get directions from';


// Markers
var map_markers = Array();

// Default marker
map_markers[0] = Array();
map_markers[0]["label"] = "GameLab";
map_markers[0]["latitude"] = "51.528386";
map_markers[0]["longitude"] = "-0.078184";
map_markers[0]["daddr"] = 'E2+8AA';
map_markers[0]["zoom"] = 15;


// Main

var map,map_center,map_default;

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

function initMap()
{
	setTimeout("if(typeof GMap2!='undefined') loadMap();",10);
}

function loadMap()
{
	if (!GBrowserIsCompatible() || !(document.createElementNS || document.createElement) || !document.createTextNode) return false;
	if (!(typeof map_markers[0]=='object')) return false;


	// Try to get map element
	var elMap=getMapElement("map");


	// Create map
	map=new GMap2(elMap);
	if(!map) return false;


	$('#map')
		.wrap('<div id="map-wrap">')								// Restructure
		.before('<div id="controls"></div>');					// Controls placeholder


	// May help reduce problems for people with tremors, no fine mouse control...
	map.disableDoubleClickZoom();


	// Center map
	map_default=new GLatLng(defaults["latitude"],defaults["longitude"]);
	map.setCenter(map_default,defaults["zoom"]);
	map_center=map.getCenter();


	// Add Google Maps controls - do not want!
	//map.addControl(new GLargeMapControl(),new GControlPosition(G_ANCHOR_TOP_LEFT));
	//map.addControl(new GMapTypeControl());


	// Add custom controls
	// Built upon work by Derek Featherstone: http://ironfeathers.ca/routes/

	var up = $('<input type="image" id="up" src="images/up.gif" alt="Up">')
		.click(function(){
			map.panDirection(0,defaults["panAmount"]);
		});

	var down = $('<input type="image" id="down" src="images/down.gif" alt="Down">')
		.click(function(){
			map.panDirection(0,- defaults["panAmount"]);
		});

	var left = $('<input type="image" id="left" src="images/left.gif" alt="Left">')
		.click(function(){
			map.panDirection(defaults["panAmount"],0);
		});

	var right = $('<input type="image" id="right" src="images/right.gif" alt="Right">')
		.click(function(){
			map.panDirection(- defaults["panAmount"],0);
		});

	var centre = $('<input type="image" id="reset" src="images/reset.gif" alt="Reset">')
		.click(function(){
			//var bounds = map.getBounds();
			//map.panTo(bounds.getCenter());
			//map.setCenter(map_center);
			map.setCenter(map_center,defaults["zoom"]);
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
			//map.setCenter(map_center);
		});

	var mediummap = $('<input type="image" id="medium-map" src="images/medium-map.gif" alt="Medium map">')
		.click(function(){
			$('#map')
				.removeClass('small')
				.addClass('medium')
				.removeClass('large');
			map.checkResize();
			//map.setCenter(map_center);
		});

	var largemap = $('<input type="image" id="large-map" src="images/large-map.gif" alt="Large map">')
		.click(function(){
			$('#map')
				.removeClass('small')
				.removeClass('medium')
				.addClass('large');
			map.checkResize();
			//map.setCenter(map_center);
		});

	var map_resize = $('<div>')
		.attr('id','map-resize')
		.append('<h2>Map size</h2>')
		.append(smallmap)
		.append(mediummap)
		.append(largemap);


	// Set up map toggle as a keyboard accessible element
	$('#map-wrap')
		.before('<div id="map-toggle"><input type="image" src="images/close-map.gif" alt="Close the map" /></div>');
	$('#map-toggle input')
		.click(function(){
			$('#map-wrap').toggle(function(){
				if ($(this).css('display')=='none') {
					$('#map-toggle input')
						.attr('src','images/open-map.gif')
						.attr('alt','Open the map');
				}else{
					$('#map-toggle input')
						.attr('alt','images/close-map.gif')
						.attr('alt','Close the map');
				}
			});
		});


	// Generate the controls
	$('#controls')
		.append(map_control)
		.append(map_resize);


	// Add markers
	for(var i=map_markers.length-1; i>=0; i--){
		// Set HTML
		var map_html='<div id="map-overlay"><form method="get" action="http://maps.google.com/maps">';
		//map_html += '<p><label for="saddr">'+defaults["directions_label"]+': </label><input class="text" type="text" id="saddr" name="saddr" value="" /><input type="hidden" name="daddr" value="' + map_markers[i]["daddr"] + '" /><input type="hidden" name="hl" value="en" /><input class="submit" type="submit" value="Go" /></p>';
		map_html += '</form></div>';

		map_markers[i]["html"]=map_html;

		// Set marker position
		map_markers[i]["latlng"]=new GLatLng(parseFloat(map_markers[i]["latitude"]),parseFloat(map_markers[i]["longitude"]));

		// Create and add marker
		map_markers[i]["marker"]=new GMarker(map_markers[i]["latlng"]);
		map_markers[i]["marker"].value=i;
		map.addOverlay(map_markers[i]["marker"]);
	};


	return true;
}

function getMapElement(id)
{
	var elMap=document.getElementById(id);
	if(!elMap) return false;
	while(elMap.hasChildNodes()) elMap.removeChild(elMap.firstChild);
	return elMap;
}

addLoadEvent(initMap);

window.onunload=function()
{
	if(typeof GUnload!='undefined') GUnload();
}


// Directions

function getDirections (map, containerId, fromAddress, toAddress) {
	gdir = new GDirections(map, document.getElementById(containerId));
	gdir.load("from: " + fromAddress + " to: " + toAddress, { "locale": en_UK });	
}


