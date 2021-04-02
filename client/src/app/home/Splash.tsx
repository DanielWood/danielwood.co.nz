import React, { useEffect, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import Typist from 'react-typist';
import { useStickyWheel } from '@/modules/StickyWheel';
import cx from 'classnames';
import Navbar from '@/app/common/Navbar';
import ScrollCue from '@/app/common/ScrollCue';
import CanvasTypist from './CanvasTypist';
import Computer from './Computer';
import ParticleEmitter from './ParticleEmitter';
import CrazyTopology from './CrazyTopology';
import Effects from './Effects';
import keyframes from './store';
import { animated as a, useSpring } from 'react-spring/three';

// Custom camera rig
const Rig = ({ wheel, lookAt = new THREE.Vector3() }) => {
    const { gl } = useThree();

    useEffect(() => {
        // gl.setClearColor(0x0e3a9a);
        gl.setClearColor(0x00000f);
    });

    const cameraOffset = useMemo(() => new THREE.Euler(-50, 0, 2), []);
    useFrame(({ camera, mouse, clock }) => {
        camera.position.setX(
            THREE.MathUtils.lerp(camera.position.x, keyframes.cameraPos[wheel.target].x, 0.1) + wheel.getNudge()
        );
        //camera.position.setZ(THREE.MathUtils.lerp(camera.position.z, cameraOffset.z + mouse.x * -1.5, 0.05));
        // camera.position.setZ(wheel.nudge + THREE.MathUtils.lerp(camera.position.z, wheel.getTarget() * 60, 0.1));
        // camera.lookAt(0, 0, 0);
        const y = THREE.MathUtils.lerp(camera.rotation.y, keyframes.cameraRot[wheel.target].y, 0.6);
        camera.lookAt(-60, y, 0);
        // camera.lookAt(new THREE.Vector3(camera.position.x - 10, 0, camera.position.z));
    });

    return <></>;
};

const ScrollInWrapper = ({ targetValue, className, activeClasses, children, ...rest }) => {
    const wheel = useStickyWheel();
    return (
        <div className={cx(className, { [activeClasses]: wheel.target === targetValue })} {...rest}>
            {children}
        </div>
    );
};

const Intro = ({}) => {
    const { target } = useStickyWheel();
    const divRef = useRef<HTMLDivElement>(null!);

    return (
        <>
            <Navbar locationPercent={target === 1 ? 12 : 50} />
            <ScrollInWrapper
                scrollValue={target}
                targetValue={0}
                className="transition-all duration-500 opacity-0"
                activeClasses="opacity-100"
            >
                <div ref={divRef} className="block mt-48 mx-auto h-auto w-3/5 md:w-2/5">
                    <p className="text-lg text-gray-100 font-normal tracking-tight font-mono">
                        <Typist
                            startDelay={1000}
                            avgTypingDelay={35}
                            stdTypingDelay={30}
                            cursor={{ blink: true, hideWhenDone: true }}
                        >
                            Hi there. <Typist.Delay ms={500} />
                            <br />
                            <br />
                            I'm DAnielk
                            <Typist.Backspace count={7} delay={100} />
                            Daniel.
                            <Typist.Delay ms={500} />
                            <br />
                            <br />
                            It looks like you've found my website.
                            <Typist.Delay ms={600} />
                            <span className="italic ml-3">(still working on it)</span>
                            <Typist.Delay ms={500} />
                            <br />
                            <br />
                            You can use the navbar below my name to find stuff.
                            <Typist.Delay ms={300} />
                            <br />
                            <br />
                            OR: You can scroll down (with force) to see more about me.
                            <Typist.Delay ms={150} />
                            <br />
                            <span className="text-red-400 italic font-normal">*it has 3d effects*</span>
                        </Typist>
                    </p>
                </div>
            </ScrollInWrapper>
        </>
    );
};

const Splash = ({}) => {
    const wheel = useStickyWheel();
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    return (
        <>
            <Canvas className="absolute" colorManagement shadowMap camera={{ position: [0, 0, 0], fov: 40 }}>
                <fog args={['white', 0, 1000]} />
                <Rig wheel={wheel} />
                <ambientLight intensity={0.1} />
                <directionalLight
                    color="white"
                    castShadow
                    position={[0, 6, 0]}
                    intensity={wheel.target === 0 ? 0.4 : 1.0}
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-far={200}
                    shadow-camera-left={-20}
                    shadow-camera-right={20}
                    shadow-camera-top={20}
                    shadow-camera-bottom={-20}
                />
                <Computer ref={canvasRef} />
                <CrazyTopology />
                <ParticleEmitter spread={1.5} count={2000} position={[0, 1.5, 0]} />
                <mesh receiveShadow position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeBufferGeometry attach="geometry" args={[60, 60]} />
                    <shadowMaterial attach="material" transparent opacity={0.4} />
                </mesh>

                <Effects isComputer={wheel.target === 0} />
            </Canvas>

            <div className="absolute top-0 w-screen h-screen">
                <CanvasTypist
                    ref={canvasRef}
                    startDelay={2000}
                    avgTypingDelay={80}
                    stdTypingDelay={30}
                    width={256}
                    height={256}
                    fontSize={16}
                    text={
                        'Hi there...\n\n' +
                        "I'm Daniel.\n\n" +
                        "It looks like you've found my website.\n" +
                        "(I'm still working on it)\n\n" +
                        'You can use the navbar below my name to find stuff.\n\n' +
                        'Otherwise you can scroll down (with force) to see more about me.\n'
                    }
                />
            </div>

            {/* Scroll Cue */}
            <ScrollCue className="fixed w-1/5 left-2/5 right-2/5 bottom-0 mb-2 text-gray-100" />
        </>
    );
};

export default Splash;
