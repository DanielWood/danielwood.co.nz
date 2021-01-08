import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from 'drei';
import { useStickyWheel } from '@/hooks/wheel';
import SkillDescription from './SkillDescription';
import skills from './store';
import myVertexShader from '@/res/shaders/myVertexShader.glsl';
import myFragmentShader from '@/res/shaders/myFragmentShader.glsl';
import { useDebounce } from '@react-hook/debounce';

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
        <mesh material={material} position={[0, yOffset, -5]}>
            <planeBufferGeometry attach="geometry" args={[5, 5, 10, 10]} />
            {/* <boxBufferGeometry attach="geometry" args={[1, 1, 1]} /> */}
        </mesh>
    );
};

const SkillCards = ({}) => {
    const cardsRef = useRef<THREE.Group>(null!);
    const [interval] = useState(1 / 60);
    let [deltaTime] = useState(0);
    const [getScroll] = useStickyWheel(0, 5);

    useFrame(({ clock }) => {
        // Sticky scrolling code
        cardsRef.current.position.y = getScroll() * 10;
    });

    return (
        <group rotation={[-0.3, -0.5, -0.2]} ref={cardsRef}>
            {skills.map((skill, index) => (
                <Card key={index} img={skill.image} yOffset={index * -10} />
            ))}
        </group>
    );
};

const Skills = ({}) => {
    // Calculate sticky scrolling

    return (
        <>
            <div className="fixed w-screen h-screen bg-gray-200 neg-z-1">
                <Canvas className="fixed" colorManagement>
                    <ambientLight args={[0xffffff, 1.5]} />
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
