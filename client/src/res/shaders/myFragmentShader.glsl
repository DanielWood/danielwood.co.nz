uniform float u_time;
uniform sampler2D texture1;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;

void main() {
    // vec4 t = texture2D(texture1, vUv);
    vec2 st = (gl_FragCoord.xy + u_mouse.xy) / u_resolution / 2.0;
    gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
}