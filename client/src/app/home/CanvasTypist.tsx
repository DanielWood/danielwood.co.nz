import React, { useEffect, useRef, useState, forwardRef } from 'react';

const lines = [
    'Hi there.',
    '',
    "I'm Daniel.",
    '',
    "It looks like you've found my website.",
    "(I'm still working on it)",
    '',
    'You can use the navbar below my name to find stuff.',
    '',
    'Otherwise you can scroll down (with force) to see more about me.',
    '*it has 3d effects',
];

const writeText = (canvas: HTMLCanvasElement) => {
    const fontPx = 22;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#059D82';
    ctx.font = `${fontPx}px Courier New`;

    for (let i = 0; i < lines.length; i++) {
        let x = 4;
        let y = i * fontPx + fontPx;
        for (const char of lines[i]) {
            ctx.fillText(char, x, y);
            x += fontPx * 0.55;
        }
        // ctx.fillText(lines[i], x, y);
    }
};

interface CanvasTypistProps {
    width?: number;
    height?: number;
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: string;
    startDelay?: number;
    avgTypingDelay?: number;
    stdTypingDelay?: number;
    hidden?: boolean;
    text: string;
}

var hasStarted = false;
const CanvasTypist = forwardRef<HTMLCanvasElement, CanvasTypistProps>(
    (
        {
            width = 1024,
            height = 1024,
            fontSize = 32,
            fontFamily = 'Courier New',
            fontStyle = '#059D82',
            startDelay = 0,
            avgTypingDelay = 35,
            stdTypingDelay = 30,
            hidden = true,
            text,
        },
        ref
    ) => {
        var [{ x, y, ptr }, setState] = useState({ x: 4, y: fontSize, ptr: text });
        var isStarted = useRef<boolean>(false);

        useEffect(() => {
            if (!isStarted.current) {
                isStarted.current = true;
                const canvas = (ref as React.MutableRefObject<HTMLCanvasElement>).current;
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = '#01100C';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const typeNextCharacter = function () {
                    const char = ptr[0];
                    ptr = ptr.substr(1);

                    ctx.font = `${fontSize}px ${fontFamily}`;
                    ctx.fillStyle = fontStyle;
                    ctx.shadowBlur = fontSize / 2;
                    ctx.shadowColor = fontStyle;
                    ctx.fillText(char, x, y);

                    const incrX = ctx.measureText(char).width;
                    x += incrX;
                    if (x + incrX >= width || char == '\n') {
                        x = 4;
                        y += fontSize;
                    }
                    // Request next frame
                    if (ptr.length > 0) {
                        const range = Math.random() * 2 - 1;
                        const delay = avgTypingDelay + range * stdTypingDelay;
                        setTimeout(typeNextCharacter, delay);
                    }
                };

                setTimeout(typeNextCharacter, startDelay);
            }
        });

        return <canvas ref={ref} width={width} height={height} hidden={hidden} />;
    }
);

export default CanvasTypist;
