var watershed_image_data = new Array();
var dir_arr = new Array(10);
dir_arr[0] = new Array(0, 0);
dir_arr[1] = new Array(-1, 1);
dir_arr[2] = new Array(0, 1);
dir_arr[3] = new Array(1, 1);
dir_arr[4] = new Array(-1, 0);
dir_arr[5] = new Array(0, 0);
dir_arr[6] = new Array(1, 0);
dir_arr[7] = new Array(-1, -1);
dir_arr[8] = new Array(0, -1);
dir_arr[9] = new Array(1, -1);
var print = console.log


function instant_watershed(x, y, inputtype, inputname, outputtype, outputname) {
	var load_image = function() {
		var fs = require('fs'),
			PNG = require('pngjs').PNG;

		fs.createReadStream(inputname)
			.pipe(new PNG())
			.on('parsed', function() {
				len = this.height * this.width
				watershed_image_data = new Uint8ClampedArray(len);
				i = 0;
				for (var y = 0; y < this.height; y++) {
					for (var x = 0; x < this.width; x++) {
						var idx = (this.width * y + x) << 2;
						watershed_image_data[i] = this.data[idx];
						i++;
					}
				}
				print(watershed_image_data[1412641])
				find_watershed();
			});
	}

	var load_bin = function() {
		var fs = require('fs'),
			bin = fs.readFile(inputname, (err, data) => {
  				// if (err) throw err;
  				// console.log(data);
  				watershed_image_data = data.slice(0)
  				find_watershed();
			});
	}

	var write_list = function() {
		print("writing to a list")
	}

	var write_kml = function() {
		print("writing to a kml file")
	}

	var find_watershed = function() {
		var t1 = Date.now();

		var w, h;
		w = 5900 | 0;
		h = 3680 | 0;
		x = x | 0;
		y = h - y - 1 | 0;


		var matrixbuff = new ArrayBuffer(w * h);
		var matrix = new Uint8Array(matrixbuff);
		matrix[x + w * y] = 1 | 0;
		var j = 1 | 0;
		var dirf = new Int32Array([-1, 0, 1, -1, 1, -1, 0, 1]);
		var dirg = new Int32Array([1, 1, 1, 0, 0, -1, -1, -1]);
		var e = new Uint8ClampedArray([9, 8, 7, 6, 4, 3, 2, 1]);

		var processbuff = new ArrayBuffer(11000 * 4);
		var process = new Uint32Array(processbuff);
		process[0] = x | 0;
		process[1] = y | 0;
		var c = 2 | 0;
		var o1 = 0 | 0;
		var o2 = 5500 | 0;
		while (c > o1) {
			o2 = (o1 + (o1 = o2 | 0)) - o2;
			var len = c | 0;
			c = o1 | 0;
			for (var k = o2 | 0; k < len; k += 2) {
				var arx = process[k] | 0;
				var ary = process[k + 1] | 0;
				for (var i = 7 | 0; i > -1; i--) {
					var nx = (arx + dirf[i]) | 0;
					var ny = (ary + dirg[i]) | 0;
					var ind = (ny * w + nx) | 0;
					if (watershed_image_data[ind] === e[i]) {
						process[c++] = nx;
						process[c++] = ny;
						matrix[ind] = 1 | 0;
					}
				}
			}
		}


		var t2 = Date.now();



		var dirx = new Array(0, 0, 1, 0, -1);
		var diry = new Array(0, -1, 0, 1, 0);
		var dirxyr = new Array(0, -w, 1, w, -1);
		var found = 1 | 0;
		var curX = x | 0;
		var curY = y | 0;
		var dir = 1 | 0;
		var border = new Array();
		var sdir1 = new Array(1, 2, 3, 4, 1);
		var sdir3 = new Array(3, 4, 1, 2, 3);
		var sdir4 = new Array(2, 3, 4, 1, 2);

		var offsetx = 1;

		// first point on the border
		find_dir();
		border.push(11.5 + curX + offsetx);
		border.push(88.5 + curY);

		var icurX = curX;
		var icurY = curY;

		// second point on the border
		find_dir();
		border.push(11.5 + curX + offsetx);
		border.push(88.5 + curY);

		while (found > 0) {
			find_dir();
			if (icurX === curX && icurY === curY) {
				found = 0;
			} else {
				border.push(11.5 + curX + offsetx);
				border.push(88.5 + curY);
			}
		}


		matrix = null;
		process = null;
		dirxy = null;
		newpro = null;

		t3 = Date.now();

		print("Elapsed: ", t3 - t1)

		function find_dir() {
			var dir1 = sdir1[dir];
			var dir3 = sdir3[dir];
			var dir4 = sdir4[dir];
			var ofs = curX + w * curY;
			if (!matrix[ofs + dirxyr[dir1]]) {
				dir = dir1;
			} else if (!matrix[ofs + dirxyr[dir]]) {
				//dir=dir;
			} else if (!matrix[ofs + dirxyr[dir3]]) {
				dir = dir3;
			} else if (!matrix[ofs + dirxyr[dir4]]) {
				dir = dir4;
			} else {
				dir = 0;
			}
			curX += dirx[dir];
			curY += diry[dir];
		}
		print("Border length:", border.length)


		// check the output type and build the output

		if (outputtype == "kml") {
			write_kml();
		} else {
			write_list();
		}
	}

	if (inputtype == "png") {
		load_image();
	} else {
		load_bin();
	}
}

var main = function() {
	const err = `Usage: node watershed.js 	[-h] [-i inputfile] [-o outputfile] [-t bin|png]
				[-z bin|kml] [-x xvalue] [-y yvalue] [-r]
Options:
-r 			: don't print outputs
-h 			: help
-i inputfile		: indicate input file's path
-o outputfile		: indicate output file's path, default=ws.out
-t bin|png 		: type of input, either bin or png, default=bin
-z bin|kml 		: type of output, either kml or bin, defaul=kml
-x xvalue		: x value of the target point, should be integer
-y yvalue 		: y value of the target point, should be integer`
	const args = process.argv;
	var argv = require('minimist')(process.argv.slice(2));

	if (args.length == 2 || argv.h) {
		console.log(err)
		process.exit();
	} else {
		if (argv.r == true) {
			print = function(x) { 
			 }
		}

		var inputfile = argv.i
		print("Input File: ", inputfile)


		var outputfile = argv.o
		if (!outputfile) {
			outputfile = "ws.out"
		}
		print("Output File: ", outputfile)

		var inputtype = argv.t
		if (!inputtype) {
			inputtype = "bin"
		}
		print("Input Type: ", inputtype)

		var outputtype = argv.z
		if (!outputtype) {
			outputtype = "kml"
		}
		print("Output Type: ", outputtype)

		var xvalue = argv.x
		print("X: ", xvalue)

		var yvalue = argv.y
		print("Y: ", yvalue)


		if (!(typeof xvalue == typeof 1)) {
			console.log("X should be provided and be an integer.");
			process.exit();
		}

		if (!(typeof yvalue == typeof 1)) {
			console.log("Y should be provided and be an integer.")
			process.exit();
		}

		if (inputtype != "bin" && inputtype != "png") {
			console.log("Input type should be either png or bin.")
			process.exit();
		}

		if (outputtype != "kml" && outputtype != "list") {
			console.log("Output type should be either kml or list.")
			process.exit();
		}

		if (!(inputfile)) {
			console.log("Please provide an input file.")
			process.exit();
		}

		if (!(outputfile)) {
			console.log("Please provide an output file.")
			process.exit();
		}

		instant_watershed(xvalue, yvalue, inputtype, inputfile, outputtype, outputfile)

	}

}

main()