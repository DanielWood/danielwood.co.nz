import React, { useCallback, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import actions from './redux/actions';
import { RootState } from 'typesafe-actions';
import logo from '@/res/svg/DanielWood.svg';
import { PointLight } from 'three';

const mapStateToProps = ({ home }: RootState) => ({
    isSplashOpen: home.isSplashOpen,
});

const mapDispatchToProps = {
    closeSplash: actions.closeSplash,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps;

const Boxes = () => {
    const { size, viewport } = useThree();
    const pointLight = useRef<PointLight>(null!);
    const aspect = size.width / viewport.width;

    // useFrame((state) => {
    //     pointLight.current.position.set(state.mouse.x
    // });

    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight ref={pointLight} position={[0, 0, 0]} args={['white', 1.5, 100]} />

            <mesh position={[0, -3, 0]}>
                <boxBufferGeometry attach="geometry" args={[5, 5, 5]} />
                <meshStandardMaterial attach="material" color="red" />
            </mesh>
        </>
    );
};

// Custom camera rig
const Rig = ({ t = 0.075 }) => {
    const { camera } = useThree();
    useMemo(() => {
        console.log(camera.rotation);
    }, []);

    useFrame(({ camera, mouse }) => {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, -mouse.x * 30, t);
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, Math.PI / 2 + mouse.x / 3, t);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.x * 5, t);
    });

    return <></>;
};

const Splash = ({ closeSplash }: Props) => {
    const mousePosition = useRef([0, 0]);

    return (
        <div className="w-full h-full absolute bg-gray-900 select-none">
            <Canvas className="absolute" colorManagement shadowMap camera={{ position: [25, 0, 0], fov: 90 }}>
                <Boxes />
                <Rig t={0.007} />
            </Canvas>

            {/* Brand & exit button */}
            <div className="absolute top-1/2 left-0 ml-24">
                <img className="h-16" src={logo} alt="Daniel Wood" />
                <h1
                    className="mx-auto bg-white text-center cursor-pointer tracking-wide font-hairline"
                    onClick={closeSplash}
                >
                    CLICK HERE TO CONTINUE
                </h1>
            </div>
        </div>
    );
};

export default connector(Splash);
