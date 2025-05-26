#ifdef GL_ES
precision highp float;
#endif


#define max_iter 1000000.

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float zoom;
uniform float X;
uniform float Y;
uniform float cX;
uniform float cY;
uniform float max_iter_dyn;
vec2 pos = vec2(X, Y);
// float zoom = 0.5;
// vec2 pos = vec2(0,0);
// float max_iter_dyn = 100.;


float iterate(inout vec2 loc) {
    vec2 original = vec2(cX, cY);
    for (float iter = 0.0; iter < max_iter; iter ++) {
        if (abs(loc.x) > 3. || abs(loc.y) > 3.) {return iter;}
        if (iter > max_iter_dyn) {return 0.0;}
        loc = vec2(loc.x*loc.x - loc.y * loc.y, loc.x*loc.y*2.0);
        loc += original;
    }
    return 0.0;
}

vec2 scale_pos(vec2 loc, vec2 scaler) {
    float scale;
    if (scaler.x < scaler.y) {scale = scaler.x;}
    else {scale = scaler.y;}
    
    scale *= zoom;
    loc -= pos * scale;
    loc = loc/scale;
    loc -= scaler/scale/2.0;

    return loc;
}

vec3 hsb2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0),
                             6.0) - 3.0) - 1.0,
                     0.0,
                     1.0);
    rgb = rgb * rgb * (3.0 - 2.0 * rgb); // smoothstep
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(){
    // float zoom = 0.5;
    pos = vec2(X, Y);

    vec2 location = gl_FragCoord.xy;
    
    location = scale_pos(location, u_resolution);
    
    // location is scaled in complex plane at this point
    
    float color = 0.0;
    vec3 fincol;

    float result = iterate(location);
    if (result != 0.) {
        float len = length(location);
        color = result + 1.0 - log(log(len))/log(2.0); //smooth out the color
        // color = color/(200. + pow(0.2, log(zoom))*100.);
        color = log(1.0 + color) / (log(1.0 + max_iter_dyn));
        // fincol = vec3(1. - sqrt(color));
        fincol = hsb2rgb(vec3(sqrt(color), 0.6, 1.0)) * (1.0 - pow(color, 1.3));
    }
    
    else {fincol = vec3(0., 0., 0.);}
    
    gl_FragColor = vec4(fincol, 1.0);
}

 