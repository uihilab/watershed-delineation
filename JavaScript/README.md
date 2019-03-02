## Watershed.js

### Usage
```
Usage: node watershed.js 	[-h] [-i inputfile] [-o outputfile] [-t bin|png]
				[-z raw|kml] [-x xvalue] [-y yvalue] [-r]
Options:
-r	 		: don't print outputs
-h 			: help
-i inputfile		: indicate input file's path
-o outputfile		: indicate output file's path, default=ws.out
-t bin|png 		: type of input, either bin or png, default=bin
-z raw|kml 		: type of output, either kml or raw, default=kml
-x xvalue		: x value of the target point, should be integer
-y yvalue 		: y value of the target point, should be integer
```

### Sample Input and Output
```
$ node watershed.js -i 90.bin -t bin -x 4777 -y 897
Input File:  90.bin
Output File:  ws.out
Input Type:  bin
Output Type:  kml
X:  4777
Y:  897
Elapsed:  158
Border length: 27528
Output was saved to a KML file.
```

### Using in an external Node script
Importing can be done by `var ws = require("./watershed");`. 

Then delineation function can be called.

##### `ws.instant_watershed(x, y, inputtype, inputfile, outputtype, outputfile)`  
###### Input:  
  * x: x index on the matrix
  * y: y index on the matrix
  * inputtype: type of the input file, either png or bin
  * inputfile: path of the input file
  * outputtype: type of the output file, either kml or raw
  * outputfile: path of the output file


### Sample API usage
```
var ws = require("./watershed");

ws.instant_watershed(4777, 897, "png", "input.png", "kml", "ws.kml");
```