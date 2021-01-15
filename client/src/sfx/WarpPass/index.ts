import * as THREE from 'three';
import { extend, ReactThreeFiber } from 'react-three-fiber';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            warpPass: ReactThreeFiber.Node<WarpPass, typeof WarpPass>;
        }
    }
}

class WarpPass extends Pass {
    material: THREE.ShaderMaterial;
    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    quad: THREE.Mesh;
    time: number = 0.0;
    factor: number = 0.0;
    frequency: number = 6.0;
    uniforms = {
        byp: { value: 0 },
        tex: { type: 't', value: null },
        time: { type: 'f', value: this.time },
        factor: { type: 'f', value: this.factor },
        frequency: { type: 'f', value: this.frequency },
        resolution: { type: 'v2', value: null },
    };

    constructor(dt_size: number = 64) {
        super();

        this.uniforms.resolution.value = new THREE.Vector2(dt_size, dt_size);
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
        });

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
        this.scene.add(this.quad);
    }

    public render(
        renderer: THREE.WebGLRenderer,
        writeBuffer: THREE.WebGLRenderTarget,
        readBuffer: THREE.WebGLRenderTarget,
        deltaTime: number,
        maskActive: boolean
    ) {
        const factor = Math.max(0, this.factor);
        this.uniforms.byp.value = factor ? 0 : 1;
        this.uniforms.tex.value = readBuffer.texture;
        this.uniforms.time.value = this.time;
        this.uniforms.factor.value = this.factor;
        this.uniforms.frequency.value = this.frequency;

        this.time += 0.05;
        this.quad.material = this.material;

        if (this.renderToScreen) {
            // Canvas is used if renderTarget set to null
            renderer.setRenderTarget(null);
            renderer.render(this.scene, this.camera);
        } else {
            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
            renderer.render(this.scene, this.camera);
        }
    }
}

extend({ WarpPass });

export default WarpPass;
