import React, { useEffect, useRef, forwardRef, useMemo, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import btnSprite from '@/res/images/btnsprite.png';
import monitorTex from '@/res/images/monitor.png';
import monitorNorm from '@/res/images/monitor-normal.png';
import zxTex from '@/res/images/zxspectrum.png';

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

    const [zxMap, monitorMap, monitorNormalMap] = useMemo(() => {
        const loader = new THREE.TextureLoader();
        return [loader.load(zxTex), loader.load(monitorTex), loader.load(monitorNorm)];
    }, []);

    useFrame(() => {
        matRef.current.map.needsUpdate = true;
    });

    return (
        <>
            <group ref={groupRef} position={[-70, -0.175, 2]} scale={[2, 2, 2]}>
                {/* <pointLight position={[2.5, 0.1, 0]} color={0x059d82} intensity={1.7} /> */}
                <mesh position={[2.1, 0.1, 0]} rotation={[0, Math.PI / 2, 0]} visible={true}>
                    <planeBufferGeometry args={[3, 2.6, 4, 4]} attach="geometry" />
                    <meshBasicMaterial ref={matRef} transparent={true} attach="material" />
                </mesh>
                <mesh>
                    <boxBufferGeometry args={[4, 4, 4]} attach="geometry" />
                    <meshStandardMaterial
                        attach="material"
                        // color={0x595959}
                        // emissiveIntensity={0}
                        map={monitorMap}
                        // metalnessMap={specular}
                        // metalness={0.9}
                        normalMap={monitorNormalMap}
                        normalScale={new THREE.Vector2(1.5, 1.5)}
                    />
                </mesh>
                <group position={[3.5, -2.5, 0]} rotation={[0, 0, -Math.PI / 8]}>
                    <mesh rotation={[0, Math.PI / 2, 0]}>
                        <boxBufferGeometry args={[3, 0.5, 3]} attach="geometry" />
                        <meshStandardMaterial color={0x282929} attachArray="material" />
                        <meshStandardMaterial color={0x282929} attachArray="material" />
                        <meshStandardMaterial map={zxMap} attachArray="material" />
                        <meshStandardMaterial color={0x282929} attachArray="material" />
                        <meshStandardMaterial color={0x282929} attachArray="material" />
                        <meshStandardMaterial color={0x282929} attachArray="material" />
                    </mesh>
                </group>
            </group>
        </>
    );
});

export default Computer;
