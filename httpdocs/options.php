<?php
/**
 * Accessible Maps
 * Index
 */

require('inc/app_settings.php');

?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Settings for <?php echo APP_NAME; ?></title>
<meta name="description" content="Settings for <?php echo APP_NAME; ?>" />
<link rel="stylesheet" href="css/maps.css" type="text/css" media="screen" />
</head>

<style type="text/css" media="screen">
form p{
padding: 0;
}
</style>

<body>

<h1>Settings for <?php echo APP_NAME; ?></h1>

<form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">

<p><input type="radio" name="map_mode" value="on" id="map-on" /> <label for="map-visibility">I want to see the map.</label></p>
<p><input type="radio" name="map_mode" value="off" id="map-off" /> <label for="map-visibility">I don&#8217;t need the map.</label></p>

<p><input type="submit" value="Save Settings"></p>

</form>

<p><a href="index.php">Back to <?php echo APP_NAME; ?></a></p>

</body>

</html>
