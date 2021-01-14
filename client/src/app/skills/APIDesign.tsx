import React from 'react';
import * as THREE from 'three';

const APIDesign = ({ position = new THREE.Vector3() }) => {
    return (
        <mesh castShadow position={position}>
            <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
            <meshPhongMaterial attach="material" color="red" />
        </mesh>
    );
};

export default APIDesign;
