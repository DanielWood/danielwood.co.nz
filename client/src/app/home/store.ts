import * as THREE from 'three';

const keyframes = {
    cameraPos: [
        new THREE.Vector3(-50, 0, 0),
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(20, 0, 0),
    ],
    cameraRot: [
        new THREE.Euler(0, 0, 0),
        new THREE.Euler(0, 0, 0),
        new THREE.Euler(0, Math.PI, 0),
    ],
    bgColor: [0x00000f, 0x0e3a9a, 0x00c09f],
};

export default keyframes;
