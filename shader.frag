#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define PI 3.141592

void main(){
    vec2 pos = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);
    float time = u_time/9.0;

    color.g = abs(0.3 *(pos.x*sin(time*1.3) + pos.y*cos(time*0.78)));
    color.b = abs(0.3 * (pos.x*cos(time*1.2) + pos.y*sin(time)));

    color.r += pow(sin(time/7.),2.)*0.2;
    
    color.r += (1.0-distance(u_mouse, gl_FragCoord.xy)/length(u_resolution))*0.25;
    color.g -= (1.0-distance(u_mouse, gl_FragCoord.xy)/length(u_resolution))*0.15;


    gl_FragColor = vec4(color, 1.0);
}