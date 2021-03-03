import React, { useEffect, useRef, forwardRef, useMemo } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';

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
            <group ref={groupRef} position={[-65, -0.25, 2]} scale={[2, 2, 2]}>
                <mesh position={[2.05, 0.275, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <planeBufferGeometry args={[3.6, 3.0, 4, 4]} attach="geometry" />
                    <meshBasicMaterial ref={matRef} attach="material" />
                </mesh>
                <mesh>
                    <boxBufferGeometry args={[4, 4, 4]} attach="geometry" />
                    <meshStandardMaterial attach="material" color={0x595959} emissiveIntensity={0} />
                </mesh>
                <mesh position={[0.05, -1.2, 0]} rotation={[0, 0, -Math.PI / 9]}>
                    <boxBufferGeometry args={[4.25, 0.25, 4.25]} attach="geometry" />
                    <meshStandardMaterial attach="material" color={0x595959} emissiveIntensity={0} />
                </mesh>
            </group>
        </>
    );
});

export default Computer;
