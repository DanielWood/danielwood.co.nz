import React, { useEffect, useRef, forwardRef, useMemo } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import btnSprite from '@/res/images/btnsprite.png';
import computerMap from '@/res/images/comp_darkblue.png';
import normalMap from '@/res/images/softnormals.png';
import specularMap from '@/res/images/testspecular.png';

const Sprite = ({ img, ...props }) => {
    const tex = useMemo(() => new THREE.TextureLoader().load(img), [img]);

    return (
        <sprite {...props}>
            <spriteMaterial attach="material" map={tex} />
        </sprite>
    );
};

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

    const tex = useMemo(() => new THREE.TextureLoader().load(computerMap), []);
    const normal = useMemo(() => new THREE.TextureLoader().load(normalMap), []);
    const specular = useMemo(() => new THREE.TextureLoader().load(specularMap), []);

    useFrame(() => {
        matRef.current.map.needsUpdate = true;
    });

    return (
        <>
            <group ref={groupRef} position={[-67, -0.175, 2]} scale={[2, 2, 2]}>
                {/* <pointLight position={[2.5, 0.1, 0]} color="white" intensity={9.5} /> */}
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
                        map={tex}
                        // metalnessMap={specular}
                        // metalness={0.9}
                        normalMap={normal}
                        normalScale={new THREE.Vector2(1.5, 1.5)}
                    />
                </mesh>
                <mesh position={[0.05, -2, 0]}>
                    <boxBufferGeometry args={[3, 1, 3]} attach="geometry" />
                    <meshStandardMaterial attach="material" color={0x595959} metalness={0.5} emissiveIntensity={0} />
                </mesh>
                {/* <Sprite position={[2.01, -1.75, 1.55]} scale={[0.325, 0.25, 0.25]} img={btnSprite} /> */}
            </group>
        </>
    );
});

export default Computer;
