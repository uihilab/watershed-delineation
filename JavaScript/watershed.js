var watershed_image_data = new Array();
var dir_arr = new Array(10);
	dir_arr[0] = new Array( 0, 0);
	dir_arr[1] = new Array(-1, 1);
	dir_arr[2] = new Array( 0, 1);
	dir_arr[3] = new Array( 1, 1);
	dir_arr[4] = new Array(-1, 0);
	dir_arr[5] = new Array( 0, 0);
	dir_arr[6] = new Array( 1, 0);
	dir_arr[7] = new Array(-1,-1);
	dir_arr[8] = new Array( 0,-1);
	dir_arr[9] = new Array( 1,-1);


instant_watershed(4777,897)
function instant_watershed(x, y) {
	t1 = Date.now();

	if (watershed_image_data.length==0) {
		load_image();
	} else {
		find_watershed();
	}

	function load_image() {
		var fs = require('fs'),
		PNG = require('pngjs').PNG;

		fs.createReadStream('direction90m.png')
		  .pipe(new PNG())
		  .on('parsed', function() {
		  	len = this.height*this.width
		  	watershed_image_data = new Uint8ClampedArray(len);
		    i = 0;
		    for (var y = 0; y < this.height; y++) {
		        for (var x = 0; x < this.width; x++) {
		            var idx = (this.width * y + x) << 2;
		            	watershed_image_data[i] =  this.data[idx];
		            	i++;
		        }
		    }
		    console.log(watershed_image_data[1412641])
		    find_watershed()
		});
	}


	function find_watershed() {

	    var t3 = Date.now();

	    var w, h;
	    w = 5900|0;
        h = 3680|0;
        x=x|0;
        y=h-y-1|0;
	    

	    var matrixbuff = new ArrayBuffer(w*h);
	    var matrix = new Uint8Array(matrixbuff);
	    matrix[x+w*y] = 1|0;
	    var j=1|0;
	    var dirf = new Int32Array([-1,0,1,-1,1,-1,0,1]);
	    var dirg = new Int32Array([1,1,1,0,0,-1,-1,-1]);
	    var e = new Uint8ClampedArray([9, 8, 7, 6, 4, 3, 2, 1]);

	      var processbuff = new ArrayBuffer(11000*4);
	      var process = new Uint32Array(processbuff);
	      process[0]=x|0;
	      process[1]=y|0;
	      var c=2|0; var o1=0|0; var o2=5500|0;
	      while (c>o1) {
	        o2=(o1+(o1=o2|0))-o2;
	        var len=c|0;
	        c=o1|0;
	        for (var k=o2|0; k<len; k+=2) {
	          var arx=process[k]|0;
	          var ary=process[k+1]|0;
	          for (var i=7|0; i>-1; i--) {
	            var nx=(arx+dirf[i])|0;
	            var ny=(ary+dirg[i])|0;
	            var ind=(ny*w+nx)|0;
	            if (watershed_image_data[ind] === e[i]) {
	              process[c++]=nx;
	              process[c++]=ny;
	              matrix[ind]=1|0;
	            }
	          }
	        }
	      }


		    var t4 = Date.now();



		    var dirx = new Array(0,0,1,0,-1);
		    var diry = new Array(0,-1,0,1,0);
		    var dirxyr = new Array(0,-w,1,w,-1);
		    var found = 1|0;
		    var curX = x|0;
		    var curY = y|0;
		    var dir = 1|0;
		    var border = new Array();
		    var sdir1 = new Array(1,2,3,4,1);
		    var sdir3 = new Array(3,4,1,2,3);
		    var sdir4 = new Array(2,3,4,1,2);

		    var offsetx = 1;

		      // first point on the border
		      find_dir();
		      border.push(11.5+curX+offsetx);
		      border.push(88.5+curY);

		      var icurX = curX;
		      var icurY = curY;

		      // second point on the border
		      find_dir();
		      border.push(11.5+curX+offsetx);
		      border.push(88.5+curY);

		      while (found>0) {
		        find_dir();
		        if (icurX===curX && icurY===curY) {
		          found=0;
		        } else {
		          border.push(11.5+curX+offsetx);
		          border.push(88.5+curY);
		        }
		      }
		    

		    matrix = null;
		    process = null;
		    dirxy = null;
		    newpro = null;

		    t5 = Date.now();

		    console.log(t5-t3)
		    function find_dir() {
		      var dir1 = sdir1[dir];
		      var dir3 = sdir3[dir];
		      var dir4 = sdir4[dir];
		      var ofs = curX+w*curY;
		      if (!matrix[ofs+dirxyr[dir1]]) {
		        dir=dir1;
		      } else if (!matrix[ofs+dirxyr[dir]]) {
		        //dir=dir;
		      } else if (!matrix[ofs+dirxyr[dir3]]) {
		        dir=dir3;
		      } else if (!matrix[ofs+dirxyr[dir4]]) {
		        dir=dir4;
		      } else {
		        dir=0;
		      }
		      curX += dirx[dir];
		      curY += diry[dir];
		    }
		    console.log(border.length)
	}

}
