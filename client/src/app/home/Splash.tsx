import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import actions from './redux/actions';
import { RootState } from 'typesafe-actions';
import logo from '@/res/svg/DanielWood.svg';
import { PointLight, Vector3 } from 'three';
import gsap from 'gsap';

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
            <pointLight ref={pointLight} position={[0, 0, 30]} args={['white', 1.5, 100]} />

            <mesh position={[0, 0, 0]}>
                <boxBufferGeometry attach="geometry" args={[5, 5, 5]} />
                <meshPhongMaterial attach="material" color="red" />
            </mesh>
        </>
    );
};

// const colors = [0x00429d, 0x2e59a8, 0x4771b2, 0x5d8abd, 0x73a2c6, 0x8abccf, 0xa5d5d8, 0xc5eddf, 0xffffe0];
const colors = [0x540d6e, 0xee4266, 0x0090c1, 0x2cda9d, 0xffd23f];

const Particles = ({ count = 100, size = 5 }) => {
    const particle = useRef<THREE.InstancedMesh>(null!);

    // Generate random color array
    const colorArray = useMemo(() => {
        let tempColor = new THREE.Color();
        return Float32Array.from(
            new Array(count * 3).fill(0).flatMap(() => {
                let randomIndex = Math.floor(Math.random() * colors.length);
                return tempColor.set(colors[randomIndex]).toArray();
            })
        );
    }, [count]);

    const positions = useMemo(() => {
        let tempPosition = new THREE.Vector3();
        return new Array(count)
            .fill(0)
            .map(
                () =>
                    new THREE.Vector3(
                        (Math.random() * 2 - 1) * 25,
                        (Math.random() * 2 - 1) * 25,
                        (Math.random() * 2 - 1) * 25
                    )
            );
    }, [count]);

    const tempObject = useMemo(() => new THREE.Object3D(), []);

    useFrame(({ clock }) => {
        let time = clock.elapsedTime;

        let id = 0;
        for (let i = 0; i < count; i++) {
            tempObject.position.x = positions[i].x + Math.cos(time / 3 + i);
            tempObject.position.y = positions[i].y + Math.sin(time / 1 + i);
            tempObject.position.z = positions[i].z - Math.cos(time / 6 + i);

            tempObject.updateMatrix();
            particle.current.setMatrixAt(i, tempObject.matrix);
        }
        particle.current.instanceMatrix.needsUpdate = true;
    });

    useEffect(() => {
        console.log(colorArray);
    });

    return (
        <instancedMesh ref={particle} args={[null!, null!, count]}>
            <sphereBufferGeometry attach="geometry" args={[0.2, 10, 10]}>
                <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
            </sphereBufferGeometry>
            <meshToonMaterial attach="material" vertexColors={THREE.VertexColors as any} />
        </instancedMesh>
    );
};

// Custom camera rig
const Rig = ({ lookAt = new THREE.Vector3() }) => {
    useFrame(({ camera, mouse, clock }) => {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, mouse.x * -8, 0.08);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 8, 0.08);
        camera.lookAt(lookAt);
    });

    return <></>;
};

const Splash = ({ closeSplash }: Props) => {
    const mousePosition = useRef([0, 0]);

    return (
        <div className="w-full h-full absolute bg-gray-900 select-none">
            <Canvas className="absolute" colorManagement shadowMap camera={{ position: [25, 0, 0], fov: 90 }}>
                <Boxes />
                <Particles count={1000} />
                <Rig />
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
