uniform int byp; //should we apply the glitch ?
uniform float time;
uniform float factor;
uniform vec2 resolution;
uniform sampler2D tex;
  
varying vec2 vUv;
    
void main() {  
	if (byp<1) {
		vec2 uv1 = vUv;
		vec2 uv = gl_FragCoord.xy/resolution.xy;
		float frequency = 12.0;
		float amplitude = 0.015 * factor;
		float x = uv1.y * frequency + time * .7; 
		float y = uv1.x * frequency + time * .3;
		uv1.x += cos(x+y) * amplitude * cos(y);
		uv1.y += sin(x-y) * amplitude * cos(y);
		vec4 rgba = texture2D(tex, uv1);
		gl_FragColor = rgba;
	} else {
		gl_FragColor = texture2D(tex, vUv);
	}
}