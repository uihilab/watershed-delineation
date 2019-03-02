## Watershed.go

### Usage
First compile the script using `go build watershed.go`. Then the the command-line interface could be used as follows,
```
Usage: ./watershed 	[-h] [-i inputfile] [-o outputfile] [-t bin|png]
				[-z raw|kml] [-x xvalue] [-y yvalue] [-r]
Options:
-r	 		: don't print outputs
-h 			: help
-i inputfile	 : indicate input file's path
-o outputfile	  : indicate output file's path, default=ws.out
-t bin|png 		: type of input, either bin or png, default=bin
-z raw|kml 		: type of output, either kml or raw, default=kml
-x xvalue		: x value of the target point, should be integer
-y yvalue 		: y value of the target point, should be integer
```

### Sample Input and Output
```
$ ./watershed -x 4777 -y 897 -i direction90m.png -o ws.kml -t png -z kml
Input file: direction90m.png
Output file: ws.kml
Input type: png
Output type: kml
X: 4777
Y: 897
```

### Using in an external Go program
Package version of the Go implementation can be downloaded to the system by running `go get github.com/Iowa-Flood-Center/watershed-delineation` command.
Importing can be done by `import "github.com/Iowa-Flood-Center/watershed-delineation/Go/watershed"` afterwards. 

Following are the functions that can be used.

##### `watershed.LoadImage(image_path)`  
###### Input:  
  * image_path: path of the PNG file
###### Output:
  * direction matrix in a list that can be fed into `watershed.FindWatershed`.


#### `watershed.LoadBin(bin_path)`  
###### Input:  
  * bin_path: path of the binary file
###### Output:
  * direction matrix in a list that can be fed into `find_watershed`.

#### `watershed.SaveKML(border, file)`  
###### Input:  
  * border: border slice that is outputted by the `watershed.FindWatershed` function.  
  * file: path of the output file


#### `watershed.SaveRaw(border, file)`  
###### Input:  
  * border: border slice that is outputted by the `watershed.FindWatershed` function.  
  * file: path of the output file

#### `watershed.FindWatershed(x, y, direction_matrix)`  
###### Input:  
  * x: x index on the matrix
  * y: y index on the matrix
  * direction_matrix: direction matrix list read by either `watershed.LoadImage` or `watershed.LoadBin`

###### Output:
  * border: border list of the watershed, can be used to generate coordinate pairs and KML using `watershed.SaveKML` or `watershed.SaveRaw`.

### Sample API usage
```
package main

import (
  "github.com/Iowa-Flood-Center/watershed-delineation/Go/watershed"
)

func main() {
  data := watershed.LoadImage("direction90m.png")
  border := watershed.FindWatershed(4777, 897, data)
  watershed.SaveKML(border, "ws.kml")
}
```