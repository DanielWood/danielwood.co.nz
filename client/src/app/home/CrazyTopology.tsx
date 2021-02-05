import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from 'react-three-fiber';

const CrazyTopology = ({ position = new THREE.Vector3() }) => {
    const localPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-0.8, 0.0, 0), 0.8), []);
    const plane2 = useMemo(() => new THREE.Plane(new THREE.Vector3(0.75, 0, 0), 0.4), []);
    const globalPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.1), []);
    const { gl, clock } = useThree();
    useEffect(() => {
        gl.localClippingEnabled = true;
    });

    const knot = useRef<THREE.Mesh>(null!);
    const knot2 = useRef<THREE.Mesh>(null!);
    const knot3 = useRef<THREE.Mesh>(null!);
    var lastTime = clock.getElapsedTime();
    useFrame(({ clock, mouse }) => {
        const delta = clock.getElapsedTime() - lastTime;
        lastTime = clock.getElapsedTime();

        const speed = Math.abs(Math.sin(clock.getElapsedTime() / 10)) * 0.8;
        knot.current.rotation.z = knot2.current.rotation.z = knot3.current.rotation.z += delta * speed * 2;
        knot.current.rotation.y = knot2.current.rotation.y = knot3.current.rotation.y += delta * speed * 3.5;
        knot.current.rotation.x = knot2.current.rotation.x = knot3.current.rotation.x += delta * (1 - speed / 2);
    });

    return (
        <group position={position} rotation={[0, Math.PI / 2, 0]}>
            <mesh ref={knot} castShadow>
                <torusKnotBufferGeometry attach="geometry" args={[1.5, 0.54, 180, 20, 2, 3]} />
                <meshToonMaterial
                    color={0x5ba474}
                    side={THREE.DoubleSide}
                    attach="material"
                    clippingPlanes={[localPlane, plane2]}
                />
            </mesh>
            <mesh ref={knot2} castShadow>
                <torusKnotBufferGeometry attach="geometry" args={[1.5, 0.52, 180, 20, 2, 3]} />
                <meshToonMaterial
                    color={0x30475e}
                    emissive={new THREE.Color(0x30475e).multiplyScalar(0.3)}
                    attach="material"
                    side={THREE.DoubleSide}
                    clippingPlanes={[globalPlane]}
                />
            </mesh>
            <mesh ref={knot3} castShadow>
                <torusKnotBufferGeometry attach="geometry" args={[1.5, 0.5, 180, 20, 2, 3]} />
                <meshToonMaterial color={0xf05454} attach="material" side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

export default CrazyTopology;
