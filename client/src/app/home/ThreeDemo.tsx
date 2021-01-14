import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import actions from './redux/actions';
import { RootState } from 'typesafe-actions';
import logo from '@/res/svg/DanielWood.svg';
import { PointLight } from 'three';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const colors = new Array(10).fill(0x00ff00);

const Boxes = ({}) => {
    const ctx = useThree();
    const cube = useRef<THREE.InstancedMesh>(null!);
    const colorArray = useMemo(
        () => Float32Array.from(new Array(10).fill(undefined).flatMap((_, i) => tempColor.set(colors[i]).toArray())),
        []
    );

    useFrame((state) => {
        let time = state.clock.getElapsedTime();
        cube.current.rotation.x = Math.sin(time / 4);
        cube.current.rotation.y = Math.cos(time / 4);

        let i = 0;
        for (let x = 0; x < 10; x++) {
            const id = i++;
            tempObject.position.set(5 - x, 0, 0);
            tempObject.rotation.y = Math.sin(x / 4 + time);
            tempObject.rotation.z = tempObject.rotation.y * 2;
            tempObject.updateMatrix();

            cube.current.setMatrixAt(id, tempObject.matrix);
        }
        cube.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={cube} args={[null!, null!, 10]}>
            <boxBufferGeometry attach="geometry" args={[0.5, 0.5, 0.5]}>
                <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
            </boxBufferGeometry>
            <meshPhongMaterial attach="material" />
        </instancedMesh>
    );
};

const Points = ({ separation = 20, amountX = 50, amountY = 50 }) => {
    // Calculate number of particles
    const numParticles = useMemo(() => amountX * amountY, [amountX, amountY]);

    const dummyObject = useMemo(() => new THREE.Object3D(), []);
    const point = useRef<THREE.InstancedMesh>(null!);

    const { scene } = useThree();

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        // point.current.rotation.x = Math.cos(time / 2) / 4;
        // point.current.rotation.z = Math.sin(time / 2) / 4;
        // point.current.rotation.y = time / 8;

        let id = 0;
        for (let x = 0; x < amountX; x++) {
            for (let y = 0; y < amountY; y++) {
                dummyObject.position.x = x * separation - (amountX - separation) / 2;
                dummyObject.position.y = 30 * (Math.sin(x / 4 + time * 2) + Math.sin(y / 4 + time * 2));
                dummyObject.position.z = y * separation - (amountY - separation) / 2;
                dummyObject.updateMatrix();

                point.current.setMatrixAt(id++, dummyObject.matrix);
            }
        }
        point.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={point} args={[null!, null!, numParticles]}>
            <sphereBufferGeometry attach="geometry" args={[5, 12, 12]} />
            <meshPhongMaterial attach="material" color="white" />
        </instancedMesh>
    );
};

const ThreeDemo = ({}) => {
    return (
        <div className="w-full h-full absolute bg-gray-900 select-none">
            <Canvas
                className="absolute w-full h-full block"
                colorManagement
                camera={{
                    position: [500, 100, 1200],
                    fov: 65,
                    near: 1,
                    far: 10000,
                }}
            >
                <pointLight position={[-1, 2, 4]} args={['white', 5]} />
                <ambientLight intensity={0.6} />
                <Points />
            </Canvas>

            {/* Brand & exit button */}
            <div className="absolute top-1/2 left-0 xl:ml-24">
                <img className="h-16" src={logo} alt="Daniel Wood" />
                <h1 className="mx-auto bg-white text-center cursor-pointer tracking-wide font-hairline">
                    CLICK HERE TO CONTINUE
                </h1>
            </div>
        </div>
    );
};

export default ThreeDemo;
