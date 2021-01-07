import React from 'react';
import * as THREE from 'three';

interface Props {
    title: string;
    text: string;
}

const SkillCard = ({ title, text }: Props) => (
    <div className="flex w-full h-full flex-row">
        <div className="w-1/2 my-auto ml-32">
            <h1 className="mx-auto text-xl font-bold">{title}</h1>
            <p className="mx-auto text-lg font-light">{text}</p>
        </div>
    </div>
);

export default SkillCard;
