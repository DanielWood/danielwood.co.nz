import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import '@/sfx/WarpPass';

extend({
    EffectComposer,
    RenderPass,
    FilmPass,
    UnrealBloomPass,
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
            {/* <unrealBloomPass attachArray="passes" /> */}
            {/* <filmPass attachArray="passes" args={[0.1, 0.1, 512, false]} /> */}
            {/* <warpPass attachArray="passes" factor={5.0} frequency={3} /> */}
            <warpPass attachArray="passes" factor={1.5} frequency={3} />
            <unrealBloomPass attachArray="passes" args={[aspect, 1.5, 0.2, 0.1]} />
            <filmPass attachArray="passes" args={[0.1, 0.1, 512, false]} />
        </effectComposer>
    );
};

export default Effects;
