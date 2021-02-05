import React, { useEffect, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { useStickyWheel } from '@/hooks/wheel';
import cx from 'classnames';
import actions from './redux/actions';
import { RootState } from 'typesafe-actions';
import ScrollCue from '@/app/common/ScrollCue';
import Effects from '@/app/common/Effects.jsx';
import ParticleEmitter from './ParticleEmitter';
import CrazyTopology from './CrazyTopology';

const mapStateToProps = ({ home }: RootState) => ({
    isSplashOpen: home.isSplashOpen,
});

const mapDispatchToProps = {
    closeSplash: actions.closeSplash,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps;

// Custom camera rig
const Rig = ({ wheel, lookAt = new THREE.Vector3() }) => {
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

const Brand = ({ target }) => (
    <div
        className={cx(
            'flex h-full justify-center md:justify-start md:ml-12 lg:ml-16 transition-opacity duration-500 opacity-0',
            {
                'opacity-100': Math.round(target) === 1,
            }
        )}
    >
        <div className="block md:mb-32 md:mt-auto mt-2">
            <h1 className="h-16 text-5xl text-gray-100">
                <span className="font-extrabold">DANIEL</span>
                <span className="font-hairline ml-1">WOOD</span>
            </h1>
            <h1 className="mx-auto bg-gray-100 text-gray-700 text-center text-lg font-normal">FULL STACK DEVELOPER</h1>
        </div>
    </div>
);

const Splash = ({ closeSplash }: Props) => {
    const wheel = useStickyWheel(0, 2, 1);

    return (
        <div className="w-full h-screen absolute bg-blue-600 select-none">
            <Canvas className="absolute" colorManagement shadowMap camera={{ position: [-30, 0, 0], fov: 40 }}>
                {/* <fog args={['white', 0, 50]} /> */}
                <Rig wheel={wheel} />
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
                <CrazyTopology />
                <ParticleEmitter />
                <mesh receiveShadow position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeBufferGeometry attach="geometry" args={[60, 60]} />
                    <shadowMaterial attach="material" transparent opacity={0.4} />
                </mesh>

                <Effects />
                {/* <OrbitControls /> */}
            </Canvas>

            <div className="absolute top-0 w-screen h-screen pointer-events-none">
                <Brand target={wheel.target} />
            </div>

            {/* Scroll Cue */}
            <ScrollCue className="fixed w-1/5 left-2/5 right-2/5 bottom-0 mb-2 text-gray-100" />
        </div>
    );
};

export default connector(Splash);
