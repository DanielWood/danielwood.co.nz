import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import SkillCard from './SkillCard';
import skills from './store';
import myVertexShader from '@/res/shaders/myVertexShader.glsl';
import myFragmentShader from '@/res/shaders/myFragmentShader.glsl';

const Skills = ({}) => {
    const myMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: myVertexShader,
            fragmentShader: myFragmentShader,
        });
    }, []);

    console.log(myVertexShader);
    console.log(myFragmentShader);

    return (
        <>
            <div className="fixed w-screen h-screen bg-green-400 neg-z-1">
                <Canvas className="fixed" colorManagement>
                    <ambientLight args={[0xffffff, 1.5]} />
                    <mesh material={myMaterial}>
                        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
                        {/* <myMaterial attach="material" /> */}
                        {/* <meshPhongMaterial attach="material" color={0x50f84a} /> */}
                    </mesh>
                </Canvas>
            </div>
            <div className="absolute top-0 w-full h-full">
                {skills.map((skill, index) => (
                    <SkillCard key={index} title={skill.title} text={skill.text} />
                ))}
            </div>
        </>
    );
};

export default Skills;
