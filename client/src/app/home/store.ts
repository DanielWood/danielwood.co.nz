import * as THREE from 'three';

const keyframes = {
    cameraPos: [
        { x: -50, y: 0, z: 2 },
        { x: 10, y: 0, z: 2 },
        { x: 20, y: 0, z: 2 },
    ],
    cameraRot: [
        new THREE.Vector3(-60, 0, 0),
        new THREE.Vector3(-60, 0, 0),
        new THREE.Vector3(-60, 100, 0),
    ],
    bgColor: [0x00000f, 0x0e3a9a, 0x00c09f],
};

export default keyframes;
