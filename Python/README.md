## Watershed.py

### Usage
```
Usage: python watershed.py 	[-h] [-i inputfile] [-o outputfile] [-t bin|png]
				[-z raw|kml] [-x xvalue] [-y yvalue] [-r]
Options:
-r	 			: don't print outputs
-h 				: help
-i inputfile	: indicate input file's path
-o outputfile	: indicate output file's path, default=ws.out
-t bin|png 		: type of input, either bin or png, default=bin
-z raw|kml 		: type of output, either kml or raw, default=kml
-x xvalue		: x value of the target point, should be integer
-y yvalue 		: y value of the target point, should be integer
```

### Sample Input and Output
```
$ python watershed.py -i 90.bin -t bin -x 4777 -y 897
Input File:  90.bin
Input Type:  bin
X:  4777
Y:  897
Total Border Length:  27528
Total Elapsed Time:  10.3 sec(s)
```

### Using in an external Python script
Importing can be done by `import watershed`. 

Following are the functions that can be used.

##### `get_data_from_image(image_path)`  
###### Input:  
  * image_path: path of the PNG file
###### Output:
  * direction matrix in a list that can be fed into `find_watershed`.


#### `get_data_from_binary(bin_path)`  
###### Input:  
  * bin_path: path of the binary file
###### Output:
  * direction matrix in a list that can be fed into `find_watershed`.

#### `save_to_kml(border, file)`  
###### Input:  
  * border: border list that outputted by the `find_watershed` function.  
  * file: path of the output file


#### `save_to_raw(border, file)`  
###### Input:  
  * border: border list that outputted by the `find_watershed` function.  
  * file: path of the output file

#### `find_watershed(x, y, direction_matrix)`  
###### Input:  
  * x: x index on the matrix
  * y: y index on the matrix
  * direction_matrix: direction matrix list read by either `get_data_from_image` or `get_data_from_binary`

###### Output:
  * border: border list of the watershed, can be used to generate coordinate pairs and KML using `save_to_kml` or `save_to_raw`.

### Sample API usage
```
import watershed

img_data = watershed.get_data_from_image('direction90m.png')
border = watershed.find_watershed(4777, 897, img_data)

watershed.save_to_kml(border, "watershed.kml")
```