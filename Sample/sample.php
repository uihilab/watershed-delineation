<?php

$inputfile = '90.bin';
$inputtype = 'bin';
$outputfile = 'ws.kml';
$outputtype = 'kml';
$x = 4777;
$y = 897;

# This implementation assumes that a compiled executable named as "watershed"
# exists in the same directory as this script.

$cmd = "./watershed -i " . $inputfile . " -o " . $outputfile . " -t " . $inputtype . " -z " . $outputtype . " -x " . $x . " -y " . $y;
echo shell_exec($cmd);

?>