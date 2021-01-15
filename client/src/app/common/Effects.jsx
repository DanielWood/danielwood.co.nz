import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import UnrealBloomPass from '@/sfx/UnrealBloomPass';
import WarpPass from '@/sfx/WarpPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass';

extend({
    EffectComposer,
    RenderPass,
    GlitchPass,
    FilmPass,
    ClearPass,
});

const Effects = ({}) => {
    const composer = useRef(null);
    const { gl, scene, camera, size } = useThree();
    const aspect = useMemo(() => new THREE.Vector2(512, 512), []);
    useEffect(() => {
        composer.current.setSize(size.width, size.height);
        // console.log(warpPassOld);
        // console.log(warpPass);
    }, [size]);
    useFrame(() => composer.current.render(), 1);
    return (
        <effectComposer ref={composer} args={[gl]}>
            <renderPass attachArray="passes" scene={scene} camera={camera} />
            <filmPass attachArray="passes" args={[0.1, 0.1, 512, false]} />
            <warpPass attachArray="passes" factor={0.8} />
            {/* <unrealBloomPass attachArray="passes" args={[aspect, 0.3, 0.9, 0.1]} /> */}
        </effectComposer>
    );
};

export default Effects;
