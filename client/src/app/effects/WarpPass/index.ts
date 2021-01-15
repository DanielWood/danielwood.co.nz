import {
    Mesh,
    OrthographicCamera,
    PlaneBufferGeometry,
    Scene,
    ShaderMaterial,
    Vector2,
} from 'three';
import * as THREE from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';

class WarpPass extends Pass {
    material: THREE.ShaderMaterial;
    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    quad: THREE.Mesh;
    time: number;
    factor: number;
    uniforms = {
        byp: { value: 0 },
        tex: { type: 't', value: null },
        time: { type: 'f', value: 0.0 },
        factor: { type: 'f', value: 0.0 },
        resolution: { type: 'v2', value: null },
    };

    constructor(dt_size: number = 64) {
        super();

        this.uniforms.resolution.value = new Vector2(dt_size, dt_size);
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
        });

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new THREE.Scene();
        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
        this.scene.add(this.quad);
        this.factor = 0;
        this.time = 0;
        console.log(this);
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

export default WarpPass;
