precision lowp float;

uniform sampler2D maze;
uniform vec2 scale;

vec4 state(vec2 offset) {
    vec2 coord = (gl_FragCoord.xy + offset) / scale;
    return texture2D(maze, coord);
}


vec2 findRoute(float v)
{
    return vec2(mod(v+2.0,3.0)-1.0,2.0-ceil(v/3.0));
}

void main() {

    /*First 4*/
    vec4 fragmentColor = state(vec2(0,0));
    vec4 fragmentColor2=floor(fragmentColor*100.0+0.5);


    float r = fragmentColor2.r;
    float g = fragmentColor2.g;
    float b = fragmentColor2.b;
    float a = fragmentColor2.a;
    

    vec2 coordinate1 = findRoute(r);
    vec2 coordinate2 = coordinate1+findRoute(g);
    vec2 coordinate3 = coordinate2+findRoute(b);
    vec2 coordinate4 = coordinate3+findRoute(a);

    vec4 route;

    route.r=state(coordinate1).r;
    route.g = state(coordinate2).r;
    route.b = state(coordinate3).r;

    vec4 colorOfNewCenter = state(coordinate4);
    route.a = colorOfNewCenter.r;
    /*End of first 4*/

    /*Second 4*/

    colorOfNewCenter=floor(colorOfNewCenter*100.0+0.5);

    float r1 = colorOfNewCenter.r;
    float g1 = colorOfNewCenter.g;
    float b1 = colorOfNewCenter.b;
    float a1 = colorOfNewCenter.a;

    vec2 coordinate11 = coordinate4+findRoute(r1);
    vec2 coordinate21 = coordinate11+findRoute(g1);
    vec2 coordinate31 = coordinate21+findRoute(b1);
    vec2 coordinate41 = coordinate31+findRoute(a1);

    vec4 route1;

    route1.r = state(coordinate11).r;
    route1.g = state(coordinate21).r;
    route1.b = state(coordinate31).r;
    vec4 colorOfNewCenter2 = state(coordinate41);
    route1.a = colorOfNewCenter2.r;

    /*End of Second 4*/

    route1=floor(route1*100.0+0.5)-5.0;
    route=floor(route*100.0+0.5)-5.0;

    route=route*route1;
    float result=route.r*route.g*route.b*route.a;

    if (result == 0.0 ) {
            fragmentColor.r=0.05;//5.0/100.0
    }

    gl_FragColor = fragmentColor;//vec4(r/10.0, g/10.0, b/10.0, a/10.0);
}
