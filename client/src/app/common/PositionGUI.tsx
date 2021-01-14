import { useThrottle } from '@react-hook/throttle';
import React, { useEffect, useMemo } from 'react';
import { useFrame } from 'react-three-fiber';
import { Vector3, Euler } from 'three';

const toFixedVector = (vec: Vector3, fractionDigits: number = 2) => {
    const x = Number.parseFloat(vec.x.toFixed(fractionDigits));
    const y = Number.parseFloat(vec.y.toFixed(fractionDigits));
    const z = Number.parseFloat(vec.z.toFixed(fractionDigits));
    return new Vector3(x, y, z);
};

type Props = { position: Vector3; rotation: Euler };
const CameraGUI = ({ position, rotation }: Props) => {
    const pos = useMemo(() => toFixedVector(position), [position]);
    const rot = useMemo(() => toFixedVector(rotation.toVector3()), [rotation]);

    return (
        <div className="absolute top-0 right-0 w-auto h-auto bg-gray-900">
            <h1 className="text-sm text-white">position: [{`${pos.x}, ${pos.y}, ${pos.z}`}]</h1>
            <h1 className="text-sm text-white">rotation: [{`${rot.x}, ${rot.y}, ${rot.z}`}]</h1>
        </div>
    );
};

export default CameraGUI;
