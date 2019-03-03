var watershed_image_data;
var run_from_c;
var border;

var instant_watershed = function(x, y) {
    var imageObj = new Image();

    imageObj.onload = function() {
        t1 = Date.now();
        var e = document.createElement('canvas');
        e.crossOrigin = "anonymous";
        var c = e.getContext('2d');
        e.width = 5900;
        e.height = 3680;
        c.drawImage(imageObj, 0, 0);
        img = c.getImageData(0, 0, e.width, e.height);
        var temp = img.data;
        var len = temp.length / 4;
        watershed_image_data = new Int32Array(len);
        for (var i = 0; i < len; i++) {
            watershed_image_data[i] = temp[4 * i];
        };
        temp.length = 0;
        temp = null;
        t2 = Date.now();
        console.log("image draw time: ", t2 - t1)
        run_from_c = Module.cwrap('findWatershed', 'number', ['number', 'number', 'number']);

        run_wasm(x, y);
    };


    imageObj.src = 'input.png';

}

Module["run_ws"] = function(x, y, typedArray) {
    var numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
    var ptr = Module._malloc(numBytes);
    var heapBytes = new Uint8Array(Module.HEAPU8.buffer, ptr, numBytes);
    heapBytes.set(new Uint8Array(typedArray.buffer));
    var ret = run_from_c(x, y, heapBytes.byteOffset);
    Module._free(heapBytes.byteOffset);
    return ret;
};

var run_wasm = function(x, y) {
    t1 = Date.now();
    ptr = Module["run_ws"](x, y, watershed_image_data);
    le = Module.getValue(ptr, 'float');
    console.log("border length: ", le)
    border = [];
    for (var i = 1; i <= le; i++) {
    	border.push(Module.getValue(ptr+4*i, 'float'))
    }

    t2 = Date.now();
    console.log("run time: ", t2 - t1)
}