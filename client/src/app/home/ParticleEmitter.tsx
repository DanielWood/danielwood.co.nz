import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from 'react-three-fiber';

// interface Particle {
//     position: THREE.Vector3;
//     velocity: THREE.Vector3;
//     radius: number;
//     lifeTime: number;
//     elapsedTime: number;
//     isAlive: boolean;
// }

class Particle {
    // position: THREE.Vector3;
    // velocity: THREE.Vector3;
    // radius: number;
    // lifeTime: number;
    // startTime: number;
    // isAlive: boolean;

    private origin: THREE.Vector3;

    constructor(
        private position: THREE.Vector3,
        private velocity: THREE.Vector3,
        private radius: number,
        private lifeTime: number,
        private startTime: number,
        private isAlive: boolean
    ) {
        this.origin = position.clone();
    }

    public update(time: number): void {
        const elapsedTime = time - this.startTime;

        // Update position
        this.position.set(
            this.origin.x + Math.cos(elapsedTime + Math.PI * this.velocity.x),
            this.origin.y + elapsedTime * this.velocity.y,
            this.origin.z + Math.sin(elapsedTime + Math.PI * this.velocity.x)
        );

        // Kill off old particles
        this.isAlive = time < this.startTime + this.lifeTime;
    }

    public getPosition(): THREE.Vector3 {
        return this.position;
    }

    public getRadius(): number {
        return this.radius;
    }

    public getIsAlive(): boolean {
        return this.isAlive;
    }
}

const ParticleEmitter = ({
    count = 2000,
    spread = 2,
    minRadius = 0.01,
    maxRadius = 0.03,
    minLifeTime = 0.9,
    maxLifeTime = 3.8,
}) => {
    const instanceRef = useRef<THREE.InstancedMesh>(null!);
    const tempObject = useMemo(() => new THREE.Object3D(), []);

    var particles = useMemo(() => new Array<Particle>(), []);

    // Utility
    const randomBipolar = () => Math.random() * 2 - 1;

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        // Update particles
        for (let i = 0; i < particles.length; i++) {
            // const s = Math.max(1.5, Math.cos(t) * 5);
            const particle = particles[i];

            particle.update(time);

            tempObject.position.copy(particle.getPosition());
            tempObject.scale.setScalar(particle.getRadius());
            tempObject.updateMatrix();
            instanceRef.current.setMatrixAt(i, tempObject.matrix);
        }
        instanceRef.current.instanceMatrix.needsUpdate = true;

        // Delete dead particles
        particles = particles.filter((p) => p.getIsAlive());

        // Create new particles
        while (particles.length < count) {
            particles.push(
                new Particle(
                    new THREE.Vector3(randomBipolar() * spread, randomBipolar() * 2, randomBipolar() * spread),
                    new THREE.Vector3(randomBipolar() * 20, Math.random() * 3, randomBipolar() * 2),
                    minRadius + Math.random() * (maxRadius - minRadius),
                    minLifeTime + Math.random() * (maxLifeTime - minLifeTime),
                    time,
                    true
                )
            );
        }
    });

    return (
        <instancedMesh ref={instanceRef} args={[null!, null!, count]} castShadow receiveShadow>
            <circleBufferGeometry attach="geometry" args={[1, 3]} />
            <meshStandardMaterial
                transparent={true}
                opacity={1}
                side={THREE.DoubleSide}
                attach="material"
                color={0xffffff}
                emissive={new THREE.Color(0xffaaaa)}
                emissiveIntensity={2.5}
            />
        </instancedMesh>
    );
};

export default ParticleEmitter;
