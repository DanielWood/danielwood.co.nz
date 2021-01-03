import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as THREE from 'three';
import actions from './redux/actions';
import { RootState } from 'typesafe-actions';
import logo from '@/res/svg/DanielWood.svg';
import { PointLight } from 'three';

const ThreeDemo = ({}) => {
    const canvas = useRef<HTMLCanvasElement>(null!);

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas.current });
        const scene = new THREE.Scene();

        // Create camera
        const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
        camera.position.z = 2;

        // Create light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-1, 2, 4);
        scene.add(light);

        // Create cubes
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        function makeInstance(geometry, color, x) {
            const material = new THREE.MeshPhongMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);

            cube.position.x = x;

            return cube;
        }

        const cubes = [
            makeInstance(geometry, 0x44aa88, 0),
            makeInstance(geometry, 0x8844aa, -2),
            makeInstance(geometry, 0xaa8844, 2),
        ];

        // Resize renderer if necessary
        function resizeRenderer(renderer: THREE.WebGLRenderer) {
            const width = canvas.current.clientWidth;
            const height = canvas.current.clientHeight;
            const needResize = canvas.current.width !== width || canvas.current.height !== height;
            if (needResize) {
                renderer.setSize(width, height, false);
            }
            return needResize;
        }

        // Animate cube
        function render(time) {
            time *= 0.001;

            if (resizeRenderer(renderer)) {
                camera.aspect = canvas.current.clientWidth / canvas.current.clientHeight;
                camera.updateProjectionMatrix();
            }

            cubes.forEach((cube, i) => {
                const speed = 1 + i * 0.1;
                const rot = time * speed;
                cube.rotation.x = cube.rotation.y = rot;
            });

            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }, []);

    return (
        <div className="w-full h-full absolute bg-gray-900 select-none">
            <canvas className="absolute w-full h-full block" ref={canvas} />

            {/* Brand & exit button */}
            <div className="absolute top-1/2 left-0 xl:ml-24">
                <img className="h-16" src={logo} alt="Daniel Wood" />
                <h1 className="mx-auto bg-white text-center cursor-pointer tracking-wide font-hairline">
                    CLICK HERE TO CONTINUE
                </h1>
            </div>
        </div>
    );
};

export default ThreeDemo;
