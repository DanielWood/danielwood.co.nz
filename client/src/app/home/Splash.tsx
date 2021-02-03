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

const Swarm = ({}) => {
    return;
};

// Custom camera rig
const Rig = ({ lookAt = new THREE.Vector3() }) => {
    const wheel = useStickyWheel(0, 1, 1);
    const { gl } = useThree();
    useEffect(() => {
        gl.setClearColor(0x222831);
    });

    useFrame(({ camera, mouse, clock }) => {});

    return <></>;
};

const Splash = ({ closeSplash }: Props) => {
    const mousePosition = useRef([0, 0]);

    return (
        <div className="w-full h-screen absolute bg-white select-none">
            <Canvas className="absolute" colorManagement shadowMap camera={{ position: [30, 0, 0], fov: 50 }}>
                <Rig />
                <ambientLight intensity={0.4} />
                <directionalLight color="white" castShadow position={[0, 2, 1]} intensity={2.5} />
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
