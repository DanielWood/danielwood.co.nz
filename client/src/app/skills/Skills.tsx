import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from 'react-three-fiber';
import { FlyControls } from 'drei';
import { useThrottle } from '@react-hook/throttle';
import { useStickyWheel } from '@/hooks/wheel';
import APIDesign from './APIDesign';
import UIDesign from './UIDesign';
import skills from './store';
import myVertexShader from '@/res/shaders/myVertexShader.glsl';
import myFragmentShader from '@/res/shaders/myFragmentShader.glsl';

const cardMaterial = new THREE.ShaderMaterial({
    uniforms: {
        texture1: { value: new THREE.Texture() },
    },
    vertexShader: myVertexShader,
    fragmentShader: myFragmentShader,
});

const Card = ({ img: image, yOffset = 0 }) => {
    // Create material with specified image
    const material = useMemo(() => {
        let tmp = cardMaterial.clone();
        tmp.uniforms.texture1.value = new THREE.TextureLoader().load(image);
        return tmp;
    }, [image]);

    return (
        <mesh material={material} position={[5, yOffset, -5]}>
            <planeBufferGeometry attach="geometry" args={[5, 5, 10, 10]} />
            {/* <boxBufferGeometry attach="geometry" args={[1, 1, 1]} /> */}
        </mesh>
    );
};

const SkillCards = ({}) => {
    const stickyWheel = useStickyWheel(0, skills.length - 1);

    const lastTick = useRef<number>(null!);
    useFrame(({ camera, clock }) => {
        // Sticky scrolling code
        const scroll = stickyWheel.getScroll();
        const now = clock.getElapsedTime();
        const dt = now - (lastTick.current || 0);
        lastTick.current = now;

        const startPos = new THREE.Vector3(-5, 1, -15);
        const endPos = new THREE.Vector3(stickyWheel.target * 20, 1, 15);

        // camera.position.x += stickyWheel.getNudge();

        // camera.position.lerp(endPos, 0.1);
    });

    return (
        <>
            <UIDesign position={new THREE.Vector3(0, 0, 45)} />
            <APIDesign position={new THREE.Vector3(0, 0, 0)} />
        </>
    );
};

const Skills = ({}) => {
    return (
        <>
            <div className="fixed w-screen h-screen bg-gray-200 neg-z-1">
                <Canvas className="fixed" colorManagement shadowMap camera={{ position: [-5, 1, -15], fov: 40 }}>
                    <ambientLight args={[0xffffff, 0.3]} />
                    {/* <directionalLight position={[-1, 20, -1]} intensity={0.5} /> */}
                    <directionalLight
                        castShadow
                        position={[-1, 0.5, -1]}
                        intensity={1.5}
                        shadow-mapSize-width={4096}
                        shadow-mapSize-height={4096}
                        shadow-camera-left={-100}
                        shadow-camera-right={100}
                        shadow-camera-top={100}
                        shadow-camera-bottom={-100}
                        shadow-camera-far={100}
                    />
                    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                        <planeBufferGeometry attach="geometry" args={[100, 100]} />
                        <shadowMaterial attach="material" color={0xffffff} />
                        {/* <meshBasicMaterial attach="material" color="blue" /> */}
                    </mesh>
                    {/* <gridHelper args={[100, 100]} position={[0, -1, 0]} /> */}
                    <SkillCards />
                    <FlyControls autoForward={false} dragToLook rollSpeed={0.05} movementSpeed={2} />
                </Canvas>
            </div>
        </>
    );
};

export default Skills;
