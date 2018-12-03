
/**
 * Delineates the watershed of a given point on the DEM data using GPU.
**/
function GpuSolver(w, h, dem, canvas) {
    
    this.statesize = new Float32Array([w, h]);
    this.currentArea = new Float32Array([0.30, 0.55,1.0,0.85]);
    this.viewsize = new Float32Array([canvas.width, canvas.height]);
    var igloo = this.igloo = new Igloo(canvas);
    if (igloo == null) {
        alert('Could not initialize WebGL!');
        throw new Error('No WebGL');
    }
    var gl = igloo.gl;
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    this.programs = {
        step: igloo.program('glsl/quad.vert', 'glsl/solve.frag'),
        draw: igloo.program('glsl/quad.vert', 'glsl/draw.frag')
    };
    this.buffers = {
        quad: igloo.array(Igloo.QUAD2)
    };
    this.textures = {
        fore: igloo.texture(null, null, null, gl.NEAREST).blank(w, h),
        back: igloo.texture(null, null, null, gl.NEAREST).blank(w, h),
    };
    this.framebuffers = {
        step: igloo.framebuffer()
    };

    this.reset(dem);
    this.done = false;
    this.cancelled = false;
    this.age = 80;
}


/**
 * Swap the foreground and background states.
 * @returns {GpuSolver} this
 */
GpuSolver.prototype.swap = function() {
    var tmp = this.textures.fore;
    this.textures.fore = this.textures.back;
    this.textures.back = tmp;
    return this;
};


/**
 * Reset the DEM data to run with a new starting point.
 */
GpuSolver.prototype.reset = function(dem) {
    var w = this.statesize[0], h = this.statesize[1],
        rgba = new Uint8Array(w * h * 4);

    var directionArray = [  /*0*/   0,
                            /*1*/   w-1,
                            /*2*/   w,
                            /*3*/   w+1,
                            /*4*/   -1,
                            /*5*/   0,
                            /*6*/   1,
                            /*7*/   -w-1,
                            /*8*/   -w,
                            /*9*/   -w+1
    ];
    var firstIndex=0,current,first,second,third;
    for (var i = 0; i < dem.length; i++) {

        current = dem[i];
        firstIndex= i+directionArray[current];
        first = dem[firstIndex];

        current=first;
        firstIndex= firstIndex+directionArray[current];;
        second = dem[firstIndex];

        current=second;
        firstIndex= firstIndex+directionArray[current];;
        third = dem[firstIndex];

        rgba[i * 4 + 0] = dem[i] * 2.55; // 255/100
        rgba[i * 4 + 1] = first * 2.55;
        rgba[i * 4 + 2] = second * 2.55;
        rgba[i * 4 + 3] = third * 2.55;
    }

    this.textures.fore.subset(rgba, 0, 0, w, h);

    return this;
};

GpuSolver.prototype.step = function(n) {
    var currentArea = this.currentArea;

    n = n || 1;
    var gl = this.igloo.gl;
    gl.viewport(0, 0, this.statesize[0], this.statesize[1]);
    var step = this.programs.step.use()
        .attrib('quad', this.buffers.quad, 2)
        .uniform('scale', this.statesize)
        .uniform('currentArea', currentArea)
        .uniformi('maze', 0);
    var rgba = new Uint8Array(4);
    while (n-- > 0 && !this.done) {
        this.framebuffers.step.attach(this.textures.back);
        this.textures.fore.bind(0);
        step.draw(gl.TRIANGLE_STRIP, Igloo.QUAD2.length / 2);
        this.swap();
    }
    this.age--;

    if(this.age == 0)
    {
        this.done=true;
        this.cancelled = true;
    }
    return this;
};

/**
 * Draw the current solution to the canvas.
 */
GpuSolver.prototype.draw = function() {
    var gl = this.igloo.gl;
    this.igloo.defaultFramebuffer.bind();
    this.textures.fore.bind(0);
    gl.viewport(0, 0, this.viewsize[0], this.viewsize[1]);
    this.programs.draw.use()
        .attrib('quad', this.buffers.quad, 2)
        .uniform('viewport', this.viewsize)
        .uniform('currentArea', this.currentArea)
        .draw(gl.TRIANGLE_STRIP, Igloo.QUAD2.length / 2);

    return this;
};

/**
 * Animate the solution using requestAnimationFrame.
 * Current version solves the watershed in 1 step,
 * hence, does not animate. If animation is desired
 * this.age and the parameter to the step(800)
 * function should be modified accordingly.
 */
GpuSolver.prototype.animate = function(callback) {
    var _this = this;
    window.requestAnimationFrame(function() {
        if (!_this.done && !_this.cancelled) {
            _this.step(10).draw();
            _this.animate(callback);
        }
    });

    return this;
};

/**
 * Stop animation without calling the callback.
 */
GpuSolver.prototype.cancel = function() {
    this.cancelled = true;
    return this;
};
