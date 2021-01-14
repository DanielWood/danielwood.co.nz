import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import actions from './redux/actions';
import { RootState } from 'typesafe-actions';
import logo from '@/res/svg/DanielWood.svg';
import { PointLight, Vector3 } from 'three';
import ScrollCue from '@/app/common/ScrollCue';
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

const colors = [0x490009, 0xac0e28, 0xbc4558, 0x013766, 0x010a1c];

const Particles = ({ count = 100, spacing = 25, size = 0.5 }) => {
    const particle = useRef<THREE.InstancedMesh>(null!);
    const light = useRef<THREE.PointLight>(null!);

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
                        (Math.random() * 2 - 1) * spacing,
                        (Math.random() * 2 - 1) * spacing,
                        (Math.random() * 2 - 1) * spacing
                    )
            );
    }, [count]);

    const scales = useMemo(() => new Array(count).fill(0).map(() => Math.random() * size), [count]);

    const tempObject = useMemo(() => new THREE.Object3D(), []);

    useFrame(({ clock, mouse }) => {
        let time = clock.elapsedTime;

        light.current.position.z = THREE.MathUtils.lerp(light.current.position.z, mouse.x * -100, 0.05);
        light.current.position.y = THREE.MathUtils.lerp(light.current.position.y, mouse.y * 100, 0.05);

        let id = 0;
        for (let i = 0; i < count; i++) {
            tempObject.position.x = positions[i].x + Math.cos(time / 3 + i);
            tempObject.position.y = positions[i].y + Math.sin(time / 1 + i);
            tempObject.position.z = positions[i].z - Math.cos(time / 6 + i);
            tempObject.scale.set(scales[i], scales[i], scales[i]);

            tempObject.updateMatrix();
            particle.current.setMatrixAt(i, tempObject.matrix);
        }
        particle.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <pointLight ref={light} position={[0, 0, 30]} args={['white', 3.5, 1000]} />
            <instancedMesh ref={particle} args={[null!, null!, count]}>
                <sphereBufferGeometry attach="geometry" args={[1, 10, 10]}>
                    <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} />
                </sphereBufferGeometry>
                <meshToonMaterial attach="material" vertexColors={THREE.VertexColors as any} />
            </instancedMesh>
        </>
    );
};

// Custom camera rig
const Rig = ({ lookAt = new THREE.Vector3() }) => {
    useFrame(({ camera, mouse, clock }) => {
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, mouse.x * -1, 0.08);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 1, 0.08);
        camera.lookAt(lookAt);
    });

    return <></>;
};

const Splash = ({ closeSplash }: Props) => {
    const mousePosition = useRef([0, 0]);

    return (
        <div className="w-full h-screen absolute bg-blue-500 select-none">
            <Canvas className="absolute" colorManagement shadowMap camera={{ position: [5, 0, 0], fov: 90 }}>
                <Particles count={500} spacing={12} size={0.3} />
                <Rig />
            </Canvas>

            {/* Brand */}
            <div className="absolute top-0 w-screen h-screen pointer-events-none">
                <div className="flex h-full justify-center md:justify-start md:ml-12 lg:ml-16">
                    <div className="block md:mb-32 md:mt-auto mt-2">
                        <h1 className="h-16 text-5xl text-white">
                            <span className="font-extrabold">DANIEL</span>
                            <span className="font-hairline ml-1">WOOD</span>
                        </h1>
                        <h1 className="mx-auto bg-white text-center text-lg font-normal">FULL STACK DEVELOPER</h1>
                    </div>
                </div>
            </div>

            {/* Scroll Cue */}
            <ScrollCue className="fixed w-1/5 left-2/5 right-2/5 bottom-0 mb-2 text-gray-100" />
        </div>
    );
};

export default connector(Splash);
