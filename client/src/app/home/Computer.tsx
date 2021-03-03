import React, { useEffect, useRef, forwardRef, useMemo } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import btnSprite from '@/res/images/btnsprite.png';

const Computer = forwardRef<HTMLCanvasElement>(({}, ref) => {
    const groupRef = useRef<THREE.Group>(null!);
    const screenRef = useRef<THREE.Mesh>(null!);

    const matRef = useRef<THREE.MeshBasicMaterial>(null!);

    useEffect(() => {
        // Create texture
        var canvas = (ref as React.MutableRefObject<HTMLCanvasElement>).current;
        var tex = new THREE.CanvasTexture(canvas, THREE.UVMapping);
        matRef.current.map = tex;
    });

    useFrame(() => {
        matRef.current.map.needsUpdate = true;
    });

    return (
        <>
            <group ref={groupRef} position={[-70, -0.175, 2]} scale={[2, 2, 2]}>
                <mesh position={[2.05, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <planeBufferGeometry args={[3.4, 3.2, 4, 4]} attach="geometry" />
                    <meshBasicMaterial ref={matRef} attach="material" />
                </mesh>
                <mesh>
                    <boxBufferGeometry args={[4, 4, 4]} attach="geometry" />
                    <meshStandardMaterial attach="material" color={0x595959} emissiveIntensity={0} />
                </mesh>
                <mesh position={[0.05, -2, 0]}>
                    <boxBufferGeometry args={[3, 1, 3]} attach="geometry" />
                    <meshStandardMaterial attach="material" color={0x595959} metalness={0.5} emissiveIntensity={0} />
                </mesh>
            </group>
        </>
    );
});

export default Computer;
