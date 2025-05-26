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
uniform float max_iter_dyn;
vec2 pos = vec2(X, Y);
// float zoom = 0.5;
// vec2 pos = vec2(0,0);
// float max_iter_dyn = 100.;


float iterate(inout vec2 loc) {
    vec2 original = loc;
    for (float iter = 0.0; iter < max_iter; iter ++) {
        if (length(loc) > 2.) {return iter;}
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

void main(){
    // float zoom = 0.5;
    pos = vec2(X, Y);
    
    vec2 location = gl_FragCoord.xy;
    
    location = scale_pos(location, u_resolution);
    
    // location is scaled in complex plane at this point
    
    float color = 0.0;
    vec3 fincol;
    color = iterate(location)/max_iter_dyn;
    // if (color != 0.) {fincol = vec3(pow(color, 0.2 + log(zoom)*0.03));}
    if (color != 0.) {fincol = vec3(0.8 - pow(color, 0.2 - 0.01*pow(abs(log(zoom)), 0.8)));}
    else {fincol = vec3(0., 0., 0.);}
    
    gl_FragColor = vec4(fincol, 1.0);
}

 