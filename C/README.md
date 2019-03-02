## Watershed.c

### Usage
First compile the script using `gcc watershed.c -o watershed -lpng`.
```
Usage: ./watershed 	[-h] [-i inputfile] [-o outputfile] [-t bin|png]
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
$ ./watershed -x 4777 -y 897 -i 90.bin -o ws.kml -t bin -z kml
X: 4777
Y: 897
Input File: 90.bin
Output file: ws.kml
Input Type: bin
```