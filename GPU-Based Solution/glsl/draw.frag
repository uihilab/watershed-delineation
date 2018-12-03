precision lowp float;

uniform sampler2D maze;
uniform vec2 viewport;

float state(vec2 offset) {
    vec2 coord = (gl_FragCoord.xy + offset) / viewport;
    vec4 color = texture2D(maze, vec2(1, -1) * coord + vec2(0, 1));
    return float(color.r * 100.0 + 0.5);
}

void main() {
    float v = state(vec2(0, 0));
    vec4 color;

    if(floor(v)!=5.0)
        color = vec4(0.65, 1, 0.34, 1); // Green
    else
        color = vec4(0.19, 0.19, 1, 1); // Blue

    gl_FragColor = color;
}