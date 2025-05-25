#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

#define X -0.36966247358377
#define Y 0.14100813827721

// #define X 0.5
// #define Y 0
#define zoom 111.5
#define max_iter 10000.

uniform vec2 u_resolution;
uniform float u_time;
vec2 pos = vec2(X, Y);

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float iterate(inout vec2 loc) {
    vec2 original = loc;
    for (float iter = 0.0; iter < max_iter; iter ++) {
        if (length(loc) > 2.) {return iter;}
        loc = vec2(loc.x*loc.x - loc.y * loc.y, loc.x*loc.y*2.0);
        loc += original;
    }
    return 0.0;
}

void main(){
    
    
    // Find limiting dimension
    float scale;
    if (u_resolution.x < u_resolution.y) {scale = u_resolution.x;}
    else {scale = u_resolution.y;}
    
    scale *= zoom;
    vec2 location = gl_FragCoord.xy;
    location = location/scale;
    location -= u_resolution/scale/2.0;
    location -= pos;
    
    // location is scaled in complex plane at this point
    
    float color = 0.0;
    vec3 fincol;
    color = iterate(location)/max_iter;
    if (color != 0.) {fincol = vec3(pow(color, 0.2 + log(zoom)*0.03));}
    else {fincol = vec3(0., 0., 0.);}
    
    gl_FragColor = vec4(fincol, 1.0);
}

 