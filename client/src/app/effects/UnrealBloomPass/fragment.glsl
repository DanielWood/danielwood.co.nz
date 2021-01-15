#include <common>
varying vec2 vUv;
uniform sampler2D colorTexture;
uniform vec2 texSize;
uniform vec2 direction;

float gaussianPdf(in float x, in float sigma) {
	return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
}

// void main()
// {
// 	vec2 invSize = 1.0 / texSize;
// 	float fSigma = float(SIGMA);
// 	float weightSum = gaussianPdf(0.0, fSigma);
// 	float alphaSum = 0.0;
// 	vec3 diffuseSum = texture2D(colorTexture, vUv).rgb * weightSum;
// 	for( int i = 1; i < KERNEL_RADIUS; i ++ )
// 	{
// 		float x = float(i);
// 		float weight = gaussianPdf(x, fSigma);
// 		vec2 uvOffset = direction * invSize * x;
		
// 		vec4 sample1 = texture2D( colorTexture, vUv + uvOffset);
// 		float weightAlpha = sample1.a * weight;
// 		diffuseSum += sample1.rgb * weightAlpha;
// 		alphaSum += weightAlpha;
// 		weightSum += weight;
		
// 		vec4 sample2 = texture2D( colorTexture, vUv - uvOffset);
// 		weightAlpha = sample2.a * weight;
// 		diffuseSum += sample2.rgb * weightAlpha;
// 		alphaSum += weightAlpha;
// 		weightSum += weight;
		
// 	}
// 	alphaSum /= weightSum;
// 	diffuseSum /= alphaSum; // Should apply discard here if alphaSum is 0
// 	gl_FragColor = vec4(diffuseSum.rgb, alphaSum);
// }

void main() {
	vec2 invSize = 1.0 / texSize;
	float fSigma = float(SIGMA);
	float weightSum = gaussianPdf(0.0, fSigma);
	vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
	for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
		float x = float(i);
		float w = gaussianPdf(x, fSigma);
		vec2 uvOffset = direction * invSize * x;
		vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
		vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
		diffuseSum += (sample1 + sample2) * w;
		weightSum += 2.0 * w;
	}
	gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
}