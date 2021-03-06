import React, { useEffect, useRef, useState, forwardRef } from 'react';

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

const CanvasTypist = forwardRef<HTMLCanvasElement, CanvasTypistProps>(
    (
        {
            width = 512,
            height = 512,
            fontSize = 32,
            fontFamily = 'Courier New',
            fontStyle = '#059D82',
            startDelay = 0,
            avgTypingDelay = 150,
            stdTypingDelay = 45,
            hidden = true,
            text,
        },
        ref
    ) => {
        ref = ref || useRef<HTMLCanvasElement>(null!);
        var [ptr] = useState(String(text));
        var [[x, y]] = useState([4, fontSize]);
        var [[lastTick, delay]] = useState([0, startDelay]);

        var isStarted = useRef<boolean>(false);
        useEffect(() => {
            if (!isStarted.current) {
                isStarted.current = true;
                const canvas = (ref as React.MutableRefObject<HTMLCanvasElement>).current;
                const ctx = canvas.getContext('2d');

                // Animation callback
                lastTick = performance.now();
                const typeNextCharacter = (t: DOMHighResTimeStamp) => {
                    const dt = t - lastTick;
                    lastTick = t;

                    // Subtract the delta from the delay
                    delay -= dt;

                    var remaining = dt;
                    while (remaining > delay && ptr.length > 0) {
                        remaining -= delay;

                        const char = ptr[0];
                        ptr = ptr.substr(1);

                        const whitespace = /\s|\n/;
                        if (char.match(whitespace)) {
                            const nextWord = ptr.split(whitespace, 1)[0];
                            if (x + ctx.measureText(nextWord).width >= width || char === '\n') {
                                x = 4;
                                y += fontSize;
                                continue; // Skip leading whitespace on new line
                            }
                        }

                        ctx.font = `${fontSize}px ${fontFamily}`;
                        ctx.fillStyle = fontStyle;
                        ctx.shadowBlur = fontSize / 2;
                        ctx.shadowColor = fontStyle;
                        ctx.fillText(char, x, y);

                        x += ctx.measureText(char).width;

                        const range = Math.random() * 2 - 1;
                        delay = avgTypingDelay + range * stdTypingDelay;
                    }

                    if (ptr.length > 0) {
                        requestAnimationFrame(typeNextCharacter);
                    }
                };

                requestAnimationFrame(typeNextCharacter);
            }
        });

        return <canvas ref={ref} width={width} height={height} hidden={hidden} />;
    }
);

export default CanvasTypist;
