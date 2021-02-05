import React, { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber';
import { Box, Cylinder, OrbitControls, softShadows } from 'drei';
import useEvent from '@react-hook/event';
import actions from './redux/actions';
import { RootState } from 'typesafe-actions';
import ScrollCue from '@/app/common/ScrollCue';
import Effects from '@/app/common/Effects.jsx';
import ParticleEmitter from './ParticleEmitter';

import vertexShader from '@/res/shaders/myVertexShader.glsl';
import fragmentShader from '@/res/shaders/myFragmentShader.glsl';
import { Vector2 } from 'three';
import { useStickyWheel } from '@/hooks/wheel';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect';

const mapStateToProps = ({ home }: RootState) => ({
    isSplashOpen: home.isSplashOpen,
});

const mapDispatchToProps = {
    closeSplash: actions.closeSplash,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps;

const Logo = ({ position = new THREE.Vector3() }) => {
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

// Custom camera rig
const Rig = ({ lookAt = new THREE.Vector3() }) => {
    const wheel = useStickyWheel(0, 2, 1);
    const { gl } = useThree();
    useEffect(() => {
        gl.setClearColor(0x0e3a9a);
    });

    const cameraOffset = useMemo(() => new THREE.Euler(-50, 0, 2), []);
    useFrame(({ camera, mouse, clock }) => {
        camera.position.setX(
            THREE.MathUtils.lerp(camera.position.x, cameraOffset.x + wheel.getTarget() * 60, 0.1) + wheel.getNudge()
        );
        camera.position.setZ(THREE.MathUtils.lerp(camera.position.z, cameraOffset.z + mouse.x * -1.5, 0.05));
        // camera.position.setZ(wheel.getNudge() + THREE.MathUtils.lerp(camera.position.z, wheel.getTarget() * 60, 0.1));
        camera.lookAt(new THREE.Vector3(camera.position.x - 10, 0, camera.position.z));
    });

    return <></>;
};

const Splash = ({ closeSplash }: Props) => {
    const mousePosition = useRef([0, 0]);

    return (
        <div className="w-full h-screen absolute bg-blue-600 select-none">
            <Canvas className="absolute" colorManagement shadowMap camera={{ position: [-30, 0, 0], fov: 40 }}>
                {/* <fog args={['white', 0, 50]} /> */}
                <Rig />
                <ambientLight intensity={0.4} />
                <directionalLight
                    color="white"
                    castShadow
                    position={[0, 6, 0]}
                    intensity={1.5}
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-far={200}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />
                <pointLight position={[-30, 0, -20]} color="red" intensity={2.5} />
                <pointLight position={[0, -10, 0]} intensity={1.5} />
                <Logo />
                <ParticleEmitter />
                <mesh receiveShadow position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeBufferGeometry attach="geometry" args={[60, 60]} />
                    {/* <boxBufferGeometry attach="geometry" args={[20, 20, 20, 10, 10]} /> */}
                    <shadowMaterial attach="material" transparent opacity={0.4} />
                    {/* <meshStandardMaterial attach="material" color={0xffffff} /> */}
                    {/* <meshBasicMaterial attach="material" color={0x00ff00} /> */}
                </mesh>

                <Effects />
                {/* <OrbitControls /> */}
            </Canvas>

            {/* Brand */}
            <div className="absolute top-0 w-screen h-screen pointer-events-none">
                <div className="flex h-full justify-center md:justify-start md:ml-12 lg:ml-16">
                    <div className="block md:mb-32 md:mt-auto mt-2">
                        <h1 className="h-16 text-5xl text-gray-100">
                            <span className="font-extrabold">DANIEL</span>
                            <span className="font-hairline ml-1">WOOD</span>
                        </h1>
                        <h1 className="mx-auto bg-gray-100 text-gray-700 text-center text-lg font-normal">
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
