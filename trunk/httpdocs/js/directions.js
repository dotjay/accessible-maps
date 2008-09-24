function getDirections (map, containerId, fromAddress, toAddress) {
	gdir = new GDirections(map, document.getElementById(containerId));
	gdir.load("from: " + fromAddress + " to: " + toAddress, { "locale": en_UK });	
}
