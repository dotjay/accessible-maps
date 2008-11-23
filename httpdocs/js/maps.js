/*

Accessible Maps
http://scriptingenabed.pbwiki.com/Easy-Google-Maps

Scripting Enabled, September 2008
http://scriptingenabled.org/

Contributors:
Jon Gibbins
Ann McMeekin
Andy Ronksley
Marco Ranon
Samantha Roach
Antonia Hyde
Gilles Ruppert

*/


function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else{
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

function createElement(element) {
	element = element.toLowerCase();
	if (typeof document.createElementNS != 'undefined') {
		return document.createElementNS('http://www.w3.org/1999/xhtml', element);
	}
	if (typeof document.createElement != 'undefined') {
		return document.createElement(element);
	}
	return false;
}

function insertAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if (parent.lastChild == targetElement) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}

function wrap(element, withElement) {
	insertAfter(withElement, element);
	withElement.appendChild(element);
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

// This generates our custom map controls. We could use a button element for this, but will be using an image input element.
function mapControl(label, action) {
	if (typeof label != 'string') {
		return false;
	}

	var id = label.toLowerCase();
	id = id.replace(' ', '-');

	var control = createElement('input');
	control.setAttribute('type', 'image');
	control.setAttribute('src', 'images/' + id + '.gif');
	control.setAttribute('alt', label);
	control.setAttribute('id', id);
	control.appendChild(document.createTextNode(label));

	GEvent.addDomListener(control, "click", action);

	return control;
}

function initMap() {
	setTimeout("if (typeof GMap2 != 'undefined') loadMap();", 10);
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

	// If we were doing a typical Google Map implementation, we'd add the controls here.
	// We won't be doing that here, but for a good article on making Google's map controls accessible, see:
	// http://dev.opera.com/articles/view/keyboard-accessible-google-maps/
	//map.addControl(new GLargeMapControl(), new GControlPosition(G_ANCHOR_TOP_LEFT));
	//map.addControl(new GMapTypeControl());

	// Set up the map with the default map size
	elMap.className = mapDefaults.size;

	// Restructure (makes it easier to toggle the map)
	var wrapper = createElement('div');
	wrapper.setAttribute('id', 'map-enabled');
	wrap(elMap, wrapper);

	// Create the controls container
	var controls = createElement('div');
	controls.setAttribute('id', 'controls');

	// Generate some custom controls.
	// Built upon work by Derek Featherstone: http://ironfeathers.ca/routes/
	// We could subclass GControl and use map.addControl() for this, but that adds the control inside the map. We want to be different. :)

	// Generate custom controls for moving the map.
	var movementControls = createElement('div');
	movementControls.setAttribute('id', 'movement-controls');
	var movementControlsHeading = createElement('h2');
	movementControlsHeading.appendChild(document.createTextNode('Move the map'));
	movementControls.appendChild(movementControlsHeading);

	movementControls.appendChild(mapControl('Up', function() {
		map.panDirection(0, mapDefaults.panning);
	}));

	movementControls.appendChild(mapControl('Down', function() {
		map.panDirection(0, - mapDefaults.panning);
	}));

	movementControls.appendChild(mapControl('Left', function() {
		map.panDirection(mapDefaults.panning, 0);
	}));

	movementControls.appendChild(mapControl('Right', function() {
		map.panDirection(- mapDefaults.panning, 0);
	}));

	movementControls.appendChild(mapControl('Reset', function() {
		// This is immediate:
		//map.setCenter(map.center, mapDefaults.zoom);

		// This gives a smoother pan and doesn't reset the zoom level:
		//map.panTo(map.center);

		// This gives a smoother pan and resets the zoom level after the pan is complete:
		if (map.center == map.getCenter()) {
			map.setZoom(mapDefaults.zoom);
		} else {
			map.panTo(map.center);
			var mapMoveEvent = GEvent.addListener(map, "moveend", function() {
				// Must remove listener before setting the zoom, as zoom is considered as a movement and will retrigger this event and cause a loop.
				GEvent.removeListener(mapMoveEvent);
				map.setZoom(mapDefaults.zoom);
			});
		}
	}));

	movementControls.appendChild(mapControl('Zoom in', function() {
		map.zoomIn();
	}));

	movementControls.appendChild(mapControl('Zoom out', function() {
		map.zoomOut();
	}));

	// Generate custom controls for changing the size of the map.
	var resizeControls = createElement('div');
	resizeControls.setAttribute('id', 'resize-controls');
	var resizeControlsHeading = createElement('h2');
	resizeControlsHeading.appendChild(document.createTextNode('Map size'));
	resizeControls.appendChild(resizeControlsHeading);

	resizeControls.appendChild(mapControl('Small map', function() {
		elMap.className = 'small';
		map.checkResize();
	}));

	resizeControls.appendChild(mapControl('Medium map', function() {
		elMap.className = 'medium';
		map.checkResize();
	}));

	resizeControls.appendChild(mapControl('Large map', function() {
		elMap.className = 'large';
		map.checkResize();
	}));

	// Add the custom controls.
	controls.appendChild(movementControls);
	controls.appendChild(resizeControls);
	elMap.parentNode.insertBefore(controls, elMap);

	// Add the default markers.
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
