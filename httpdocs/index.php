<?php
/**
 * Accessible Maps
 * Index
 */

require('inc/app_settings.php');

// API key for the domain this is running on (this one is for dotjay.co.uk).
$apiKey = 'ABQIAAAAi3wHK8KfI_FQ6xD6DvlmABQu6xrhHM4N8x3ufnEG0s4KJ76z0BT7rS-F6t3ov7BAvQ-DM-_OmkKKuQ';

// The map defaults are defined here in PHP so that they can be used for both the dynamic map and the static map.
$mapDefaults = array(
	'latitude'	=> 51.528386,
	'longitude'	=> -0.078184,
	'zoom'		=> 15,
	'panning'	=> 1,
	'size'		=> 'medium',
	'width'		=> '760',
	'height'	=> '580',
	'location'	=> 'GameLab'
);

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo APP_NAME; ?></title>
<meta name="description" content="<?php echo APP_NAME; ?>: A more accessible map that may be used by people regardless of age or ability." />
<link rel="stylesheet" href="css/maps.css" type="text/css" media="screen" />

<style type="text/css" media="screen">

#map.small {
	width: 600px;
	height: 400px;
}

#map.medium {
	width: 760px;
	height: 580px;
}

#map.large {
	width: 1150px;
	height: 52em;
}

</style>

<script type="text/javascript">

// Settings
var mapDefaults = {
	latitude	: <?php echo $mapDefaults['latitude']; ?>,
	longitude	: <?php echo $mapDefaults['longitude']; ?>,
	zoom		: <?php echo $mapDefaults['zoom']; ?>,
	panning		: <?php echo $mapDefaults['panning']; ?>,
	size		: '<?php echo $mapDefaults['size']; ?>'
}

// Markers
var mapMarkers = {
	'<?php echo $mapDefaults['location']; ?>' : {
		latitude	: 51.528386,
		longitude	: -0.078184,
		zoom		: 15,
		daddr		: 'E2+8AA'
	}
}

</script>

</head>

<body>


<h1><?php echo APP_NAME; ?></h1>

<?php
// Should we be providing expalantory text at all? We're aiming to make the interface speak for itself.
/*
<div id="info">
<h2>How to use this</h2>
<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Praesent augue. Nam dignissim egestas ligula. Etiam tincidunt. Aenean tempus sodales risus. Nunc faucibus fermentum odio. Sed eu magna. Nunc sollicitudin. Nam laoreet pretium nulla. Cras vestibulum velit ac sem. Curabitur nisi dolor, malesuada nec, sollicitudin ac, dictum vel, diam. Vivamus mi nulla, imperdiet at, mattis a, dapibus aliquet, mi. Nullam erat. Suspendisse aliquam convallis nisi. In pellentesque elementum lacus. </p>
</div><?php //END info ?>
*/
?>

<div id="search">
<h2>Search</h2>
</div><?php //END search ?>


<div id="map">
<h2>Map</h2>
<p>This is a more accessible map that may be used by people regardless of age or ability.</p>

<p>The interactive map uses something called JavaScript. You need to have JavaScript to be able to play with the map. If you don&#8217;t have JavaScript, you will only see a still map below.</p>

<?php

// Build the query for the Google Static Map API.
$googleStaticMapQuery = 'center=' . $mapDefaults['latitude'] . ',' . $mapDefaults['longitude'];
$googleStaticMapQuery .= '&#38;zoom=' . $mapDefaults['zoom'];
$googleStaticMapQuery .= '&#38;size=' . $mapDefaults['width'] . 'x' . $mapDefaults['height'];
$googleStaticMapQuery .= '&#38;key=' . $apiKey;

// Add a marker to the static map.
$googleStaticMapQuery .= '&#38;markers=' . $mapDefaults['latitude'] . ',' . $mapDefaults['longitude'] . ',blues';

// Other options to add multiple markers to the static map.
/* &#38;markers=40.702147,-74.015794,blues%7C40.711614,-74.012318,greeng%7C40.718217,-73.998284,redc */

?>
<p><img src="http://maps.google.com/staticmap?<?php echo $googleStaticMapQuery; ?>" width="<?php echo $mapDefaults['width']; ?>" height="<?php echo $mapDefaults['height']; ?>" alt="Map of <?php echo $mapDefaults['location']; ?>." /></p>

</div><?php //END map ?>


<div id="directions">
<h2>Directions</h2>
<p>When you search for directions, they will appear here.</p>
</div><?php //END directions ?>


<div id="footer">
<p><a href="#">Help / Documentation</a></p>
<p><a href="options.php">Options</a></p>
<p>Code License: <a href="http://www.opensource.org/licenses/bsd-license.php" rel="nofollow">New BSD License</a></p>
<p>Content License: <a href="http://creativecommons.org/licenses/by-sa/3.0/" rel="nofollow">Creative Commons 3.0 BY-SA</a></p>
<p><a href="http://scriptingenabed.pbwiki.com/Easy-Google-Maps">Scripting Enabled wiki page</a></p>
</div><?php //END footer ?>


<script src="http://maps.google.com/maps?file=api&#38;v=2&#38;key=<?php echo $apiKey; ?>" type="text/javascript"></script>

<script src="js/maps.js" type="text/javascript"></script>

<?php
// For the jQuery version, use this:
/*
<script src="js/jquery-1.2.6.js" type="text/javascript"></script>
<script src="js/maps-jquery.js" type="text/javascript"></script>
*/
?>


</body>

</html>
