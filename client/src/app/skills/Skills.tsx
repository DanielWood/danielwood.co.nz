import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from 'drei';
import { useStickyWheel } from '@/hooks/wheel';
import SkillDescription from './SkillDescription';
import ApiDesign from './ApiDesign';
import skills from './store';
import myVertexShader from '@/res/shaders/myVertexShader.glsl';
import myFragmentShader from '@/res/shaders/myFragmentShader.glsl';
import { Vector3 } from 'three';

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

        const startPos = new Vector3(-5, 1, -15);
        const endPos = new Vector3(stickyWheel.getTarget() * 20, 1, 15);

        camera.position.x += stickyWheel.getNudge();

        camera.position.lerp(endPos, 0.1);
    });

    return (
        <>
            <ApiDesign position={new THREE.Vector3(0, 0, 0)} />
        </>
        // <group rotation={[-0.3, -0.5, -0.2]} ref={cardsRef}>
        //     {skills.map((skill, index) => (
        //         <Card key={index} img={skill.image} yOffset={index * -10} />
        //     ))}
        // </group>
    );
};

const Skills = ({}) => {
    // Calculate sticky scrolling

    return (
        <>
            <div className="fixed w-screen h-screen bg-gray-200 neg-z-1">
                <Canvas className="fixed" colorManagement shadowMap camera={{ position: [-5, 1, -15], fov: 10 }}>
                    <ambientLight args={[0xffffff, 0.5]} />
                    <directionalLight
                        castShadow
                        position={[0.25, 1, 0.25]}
                        intensity={1.5}
                        shadow-mapSize-height={512}
                        shadow-mapSize-width={512}
                    />
                    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                        <planeBufferGeometry attach="geometry" args={[100, 100]} />
                        <meshStandardMaterial attach="material" color="white" />
                    </mesh>
                    <gridHelper args={[60, 30]} position={[0, -1, 0]} />
                    <SkillCards />
                    <OrbitControls />
                </Canvas>
            </div>
            <div className="absolute top-0 w-full h-full">
                {skills.map((skill, index) => (
                    <SkillDescription key={index} title={skill.title} text={skill.text} />
                ))}
            </div>
        </>
    );
};

export default Skills;
