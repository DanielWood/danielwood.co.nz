import React, { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import skillsImage from '@/res/images/ui-skills-texture.png';

// Automatically set 3d billboard size
var [w, h] = [1, 1];
const skillsTexture = new THREE.TextureLoader().load(skillsImage, (texture) => {
    const { width, height } = texture.image;
    w = THREE.MathUtils.clamp(width / height, 0, 1);
    h = THREE.MathUtils.clamp(height / width, 0, 1);
});

const UIDesign = ({ position = new THREE.Vector3() }) => {
    const billboardRef = useRef<THREE.Mesh>(null!);
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        billboardRef.current.position.y = position.y + Math.sin(t) * 0.05;
    });

    return (
        <group position={position}>
            <mesh ref={billboardRef} castShadow rotation={[0, Math.PI * 0.8, 0]}>
                <boxBufferGeometry attach="geometry" args={[0.01, h * 2, w * 2]} />
                {/* <planeBufferGeometry attach="geometry" args={[w * 2, h * 2]} /> */}
                <meshStandardMaterial attach="material" map={skillsTexture} transparent={true} />
            </mesh>
        </group>
    );
};

export default UIDesign;
