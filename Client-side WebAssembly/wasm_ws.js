var watershed_image_data;

var load_image = function() {
	var imageObj = new Image();

	imageObj.onload = function() {
		t1 = Date.now();
		var e = document.createElement('canvas');
		e.crossOrigin="anonymous";
		var c = e.getContext('2d');
		e.width = 5900;
		e.height = 3680;
		c.drawImage(imageObj, 0, 0);
		img = c.getImageData(0, 0, e.width, e.height);
		var temp = img.data;
		var len = temp.length/4;
		watershed_image_data = new Int32Array(len);
		for (var i = 0; i < len; i++) {
			watershed_image_data[i] = temp[4*i];
		};
		temp.length = 0;
		temp = null;
		t2 = Date.now();
		console.log("image draw time: ", t2-t1)
	};


	imageObj.src = 'direction90m.png';

}

function _arrayToHeap(typedArray){
		var numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
		var ptr = Module._malloc(numBytes);
		var heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes);
		heapBytes.set(new Uint8Array(typedArray.buffer));
		return heapBytes;
	}

	function _freeArray(heapBytes){
		Module._free(heapBytes.byteOffset);
	}


	Module["run_ws"] = function(x, y, intArray){
		var heapBytes = _arrayToHeap(intArray);
		var ret = Module.ccall('findWatershed', 'number',['number','number','number'], [x, y, heapBytes.byteOffset]);
		_freeArray(heapBytes);
		return ret;
	};

var run_wasm = function() {
	t1 = Date.now();
	console.log(Module["run_ws"](4777, 897, watershed_image_data));
	t2 = Date.now();
	console.log("run time: ", t2-t1)
}