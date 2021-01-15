import React, { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { Box, Cylinder } from 'drei';
import useEvent from '@react-hook/event';
import actions from './redux/actions';
import { RootState } from 'typesafe-actions';
import ScrollCue from '@/app/common/ScrollCue';
import Effects from '@/app/common/Effects';

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

const Logo = ({}) => {
    const localPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-0.8, 0.0, 0), 0.8), []);
    const globalPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.1), []);
    const { gl } = useThree();
    useEffect(() => {
        // gl.clippingPlanes = [globalPlane];
        gl.localClippingEnabled = true;
    });

    const knot = useRef<THREE.Mesh>(null!);
    const knot2 = useRef<THREE.Mesh>(null!);
    useFrame(({ clock, mouse }) => {
        knot.current.rotation.y = knot2.current.rotation.y = clock.getElapsedTime() * 1;

        knot.current.rotation.z = knot2.current.rotation.z = clock.getElapsedTime() * 2;

        knot.current.position.x = knot2.current.position.x = THREE.MathUtils.lerp(
            knot.current.position.x,
            mouse.x * 5,
            0.05
        );
    });

    return (
        <group rotation={[0, Math.PI / 2, 0]}>
            <mesh ref={knot}>
                <torusKnotBufferGeometry attach="geometry" args={[2, 0.55, 180, 20, 2, 3]} />
                <meshToonMaterial
                    color="white"
                    emissive={new THREE.Color(0x00ff0a)}
                    emissiveIntensity={0.1}
                    side={THREE.DoubleSide}
                    attach="material"
                    clippingPlanes={[localPlane, globalPlane]}
                />
            </mesh>
            <mesh ref={knot2}>
                <torusKnotBufferGeometry attach="geometry" args={[2, 0.5, 180, 20, 2, 3]} />
                <meshStandardMaterial color="blue" attach="material" clippingPlanes={[]} />
            </mesh>
        </group>
    );
};

const Gate = ({}) => {
    const box = useRef<THREE.Mesh>(null!);
    // Setup auto-resize
    const { gl, mouse } = useThree();
    useEvent(window, 'resize', () => {
        const x = gl.domElement.clientWidth;
        const y = gl.domElement.clientHeight;
        material.uniforms.u_resolution.value = new Vector2(x, y);
    });

    useEvent(window, 'mousemove', (e) => {
        material.uniforms.u_mouse.value = new Vector2(e.clientX, e.clientY);
    });

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    u_time: { value: 0.0 },
                    u_resolution: { value: new Vector2(gl.domElement.clientWidth, gl.domElement.clientHeight) },
                    u_mouse: { value: new Vector2(mouse.x, mouse.y) },
                },
                vertexShader,
                fragmentShader,
            }),
        []
    );

    // Update material uniforms
    useFrame(({ clock }) => {
        material.uniforms.u_time.value = clock.getElapsedTime();
    });

    return (
        <group>
            <Cylinder args={[0.3, 0.4, 4, 15]} position={[0, 0, -2]} material={material} />
            <Cylinder args={[0.3, 0.4, 4, 15]} position={[0, 0, 2]} material={material} />
            <Box ref={box} args={[0.5, 1, 5]} position={[0, 2, 0]} material={material} />
        </group>
    );
};

// Custom camera rig
const Rig = ({ lookAt = new THREE.Vector3() }) => {
    const wheel = useStickyWheel(0, 1, 1);
    const from = useMemo(() => new THREE.Vector3(10, 0, 0), []);
    const to = useMemo(() => new THREE.Vector3(20, -20, -45), []);

    // const { gl } = useThree();
    // useEffect(() => {
    //     gl.setClearColor('navy');
    // });

    useFrame(({ camera, mouse, clock }) => {
        // camera.position.z = THREE.MathUtils.lerp(camera.position.z, mouse.x * -10, 0.08);
        // camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 10, 0.08);

        camera.position.lerp([from, to][wheel.getTarget()], 0.05);
        camera.lookAt(lookAt);
    });

    return <></>;
};

const Splash = ({ closeSplash }: Props) => {
    const mousePosition = useRef([0, 0]);

    return (
        <div className="w-full h-screen absolute bg-blue-500 select-none">
            <Canvas className="absolute" colorManagement shadowMap camera={{ position: [10, 0, 0], fov: 90 }}>
                <Rig />
                <ambientLight intensity={0.4} />
                <directionalLight color="white" position={[0, 2, 1]} intensity={1.5} />
                {/* <Gate /> */}
                <Logo />
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
                        <h1 className="mx-auto bg-white text-center text-lg font-normal">FULL STACK DEVELOPER</h1>
                    </div>
                </div>
            </div>

            {/* Scroll Cue */}
            <ScrollCue className="fixed w-1/5 left-2/5 right-2/5 bottom-0 mb-2 text-gray-100" />
        </div>
    );
};

export default connector(Splash);
