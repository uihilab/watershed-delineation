/* Main file to initialize the GPU program. */

var RESET_DELAY = 10 * 1000;
var DEM_90 = 1;

function imageToDEM(img)
{
     var canvas = document.createElement('canvas'),
        w = canvas.width = img.width,
        h = canvas.height = img.height,
        dem = new Uint32Array(w * h),
        ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    var data = ctx.getImageData(0, 0, w, h).data;

    var pointX = 4618;
    var pointY = 3507;

    for (var i = 0; i < w * h; i++) {
        dem[i] = data[i*4];
    }

    if(DEM_90) {
        dem[pointX+(pointY*5900)]=5;
    } else { 
        dem[pointX+(pointY*1741)]=5;
    }

    return dem;

}


var solver = null;
function init() {

    var img = new Image();
    if(DEM_90) {
        img.src = 'direction90m.png';
    } else {
        img.src = 'direction500m.png';
    }
    
    img.onload = function() {
        var canvas = $('#display')[0];

        canvas.width  = img.width;
        canvas.height = img.height;

        var canvas = $('#display')[0],
            scale = 1.0,
            
            dem = imageToDEM(this),
            w = canvas.width,
            h = canvas.height;
            

        canvas.width = w * scale;
        canvas.height = h * scale;
        t05=Date.now();

        solver = new GpuSolver(w, h, dem, canvas).draw().animate(reset);
       
        function reset() {
            window.setTimeout(function() {
                solver.reset(dem);
                solver.animate(reset);
            }, RESET_DELAY);
        }
    };
}

if (window.requestAnimationFrame == null) {
    window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
}

$(document).ready(init);
