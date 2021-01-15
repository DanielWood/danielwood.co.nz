import React, { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber';
import { Box, Cylinder } from 'drei';
import useEvent from '@react-hook/event';
import actions from './redux/actions';
import { RootState } from 'typesafe-actions';
import ScrollCue from '@/app/common/ScrollCue';
import Effects from '@/app/common/Effects.jsx';

import vertexShader from '@/res/shaders/myVertexShader.glsl';
import fragmentShader from '@/res/shaders/myFragmentShader.glsl';
import { Vector2 } from 'three';
import { useStickyWheel } from '@/hooks/wheel';

const mapStateToProps = ({ home }: RootState) => ({
    isSplashOpen: home.isSplashOpen,
});

const mapDispatchToProps = {
    closeSplash: actions.closeSplash,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps;

const colors = [0x490009, 0xac0e28, 0xbc4558, 0x013766, 0x010a1c];

const Logo = ({ position = new THREE.Vector3() }) => {
    const localPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-0.8, 0.0, 0), 0.8), []);
    const globalPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.1), []);
    const { gl } = useThree();
    useEffect(() => {
        gl.localClippingEnabled = true;
    });

    const knot = useRef<THREE.Mesh>(null!);
    const knot2 = useRef<THREE.Mesh>(null!);
    useFrame(({ clock, mouse }) => {
        knot.current.rotation.y = knot2.current.rotation.y = clock.getElapsedTime() * 1;
        knot.current.rotation.z = knot2.current.rotation.z = clock.getElapsedTime() * 2;
        // knot.current.position.x = knot2.current.position.x = THREE.MathUtils.lerp(
        //     knot.current.position.x,
        //     mouse.x * 5,
        //     0.05
        // );
    });

    return (
        <group position={position} rotation={[0, Math.PI / 2, 0]}>
            {/* <pointLight intensity={2} position={[15, 0, 0]} castShadow /> */}
            <mesh ref={knot}>
                <torusKnotBufferGeometry attach="geometry" args={[1.5, 0.55, 180, 20, 2, 3]} />
                <meshToonMaterial
                    color="green"
                    emissive={new THREE.Color(0x00ff0a)}
                    emissiveIntensity={0.1}
                    side={THREE.DoubleSide}
                    attach="material"
                    clippingPlanes={[localPlane, globalPlane]}
                />
            </mesh>
            <mesh ref={knot2}>
                <torusKnotBufferGeometry attach="geometry" args={[1.5, 0.5, 180, 20, 2, 3]} />
                <meshStandardMaterial color="blue" attach="material" clippingPlanes={[]} />
            </mesh>
        </group>
    );
};

const Arch = ({ position = new THREE.Vector3(), spread = 4 }) => {
    return (
        <group position={position}>
            <Box args={[0.5, 5, 0.5]} position={[0, 0, -spread]}>
                <meshStandardMaterial attach="material" color="red" />
            </Box>
            <Box args={[0.5, 5, 0.5]} position={[0, 0, spread]}>
                <meshStandardMaterial attach="material" color="red" />
            </Box>
        </group>
    );
};

// Custom camera rig
const Rig = ({ lookAt = new THREE.Vector3() }) => {
    const wheel = useStickyWheel(0, 1, 1);
    const start: any = useMemo(() => [new THREE.Vector3(50, 0, 0), 20], []);
    const end: any = useMemo(() => [new THREE.Vector3(10, 0, 0), 60], []);

    const keyFrames = [start, end];

    const { gl } = useThree();
    useEffect(() => {
        gl.setClearColor('navy');
    });

    useFrame(({ camera, mouse, clock }) => {
        // // camera.position.z = THREE.MathUtils.lerp(camera.position.z, mouse.x * -10, 0.08);
        // // camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 10, 0.08);
        camera.position.lerp(start[0], 0.01);
        if (camera.type === 'PerspectiveCamera') {
            camera = camera as THREE.PerspectiveCamera;
            camera.fov = THREE.MathUtils.lerp(camera.fov, start[1], 0.05);
            camera.updateProjectionMatrix();
        }

        // const index = wheel.getTarget();
        // const targetPos: THREE.Vector3 = keyFrames[index][0];
        // const targetFov = keyFrames[index][1];
        // const cam = camera as THREE.PerspectiveCamera;
        // camera.position.lerp(targetPos, 0.05);
        // const dir = targetPos.sub(camera.position).normalize();
        // const offset = keyFrames[index ? 0 : 1][0].add(dir.multiplyScalar(wheel.getNudge()));
        // camera.position.set(offset.x, offset.y, offset.z);
        // cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 0.1);
        // camera.updateProjectionMatrix();
        // (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
        // camera.position.lerp([from, to][wheel.getTarget()], 0.05);
        // camera.lookAt(lookAt);
    });

    return <></>;
};

const archWays = [25, 20, 15, 10, 5, 0, -5, -10, -15, -20, -25];
// const archWays = [5, 0, -5, -10, -15, -20, -25, -30, -35, -40, -45, -50];

const Splash = ({ closeSplash }: Props) => {
    const mousePosition = useRef([0, 0]);

    return (
        <div className="w-full h-screen absolute bg-white select-none">
            <Canvas className="absolute" colorManagement shadowMap camera={{ position: [30, 0, 0], fov: 50 }}>
                <Rig />
                <ambientLight intensity={0.4} />
                <directionalLight color="white" castShadow position={[0, 2, 1]} intensity={3.5} />
                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
                    <planeBufferGeometry attach="geometry" args={[100, 100]} />
                    <meshPhongMaterial attach="material" color={0x2e2e2e} />
                </mesh>
                {archWays.map((x, id) => (
                    <Arch key={id} position={new THREE.Vector3(x, 0, 0)} />
                ))}
                <Logo position={new THREE.Vector3(0, 0, 0)} />
                <Effects />
            </Canvas>

            {/* Brand */}
            <div className="absolute top-0 w-screen h-screen pointer-events-none">
                <div className="flex h-full justify-center md:justify-start md:ml-12 lg:ml-16">
                    <div className="block md:mb-32 md:mt-auto mt-2">
                        <h1 className="h-16 text-5xl text-white">
                            <span className="font-extrabold">DANIEL</span>
                            <span className="font-hairline ml-1">WOOD</span>
                        </h1>
                        <h1 className="mx-auto bg-white text-gray-900 text-center text-lg font-normal">
                            FULL STACK DEVELOPER
                        </h1>
                    </div>
                </div>
            </div>

            {/* Scroll Cue */}
            <ScrollCue className="fixed w-1/5 left-2/5 right-2/5 bottom-0 mb-2 text-gray-100" />
        </div>
    );
};

export default connector(Splash);
