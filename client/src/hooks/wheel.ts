import { useState } from 'react';
import useEvent from '@react-hook/event';
import { useDebounce } from '@react-hook/debounce';
import Utils from '@/utils';

export const useWheelY = (fps: number = 60, callback?: (deltaY: number) => void) => {
    const [wheelY, setWheelY] = useDebounce<number>(0, 1000 / fps);
    useEvent(window, 'wheel', (e: WheelEvent) => {
        setWheelY(e.deltaY);
        callback && callback(e.deltaY);
    });
    return wheelY;
};

export const useStickyWheel = (
    min: number,
    max: number,
    step: number = 1,
    fps: number = 60
): [number, () => void, number] => {
    const [scroll, setScroll] = useDebounce<number>(min, 1000 / fps);
    const [isStuck, setIsStuck] = useState<boolean | null>(null);
    const [lastDeltaY, setLastDeltaY] = useDebounce<number>(0, 1000 / fps);

    // Used for handling trackpad scrolls
    const [lastDeltas] = useDebounce<number[]>([], 1000 / fps);
    const [maxDeltaY, setMaxDeltaY] = useState<number>(0);

    // We will return this function to the caller
    const unStick = () => {
        setIsStuck(false);
        setLastDeltaY(0);
    };

    useWheelY(fps, (dy) => {
        // Handle trackpad movement
        const isTrackpad = Math.abs(dy) < 5;
        if (isTrackpad) {
            // Used to calculate trackpad
            if (Math.abs(dy) > maxDeltaY) setMaxDeltaY(Math.abs(dy));

            // Recalculate dy as a rolling average
            lastDeltas.push(dy);
            dy = lastDeltas.reduce((prev, cur) => prev + cur, 0) / lastDeltas.length;
            if (lastDeltas.length > 5) lastDeltas.shift();

            let didSpeedUp = Math.abs(dy) > Math.abs(lastDeltaY);
            let isGoingFast = Math.abs(dy) >= maxDeltaY / 3;
            if (!didSpeedUp || !isGoingFast) {
                setLastDeltaY(dy);
                return;
            }
        }

        if (!isStuck) {
            // Compute next scroll value
            let sign = Math.sign(dy);
            let offset = sign * step;
            let next = Utils.clamp(scroll + offset, min, max);

            console.log(`Updating scroll value to ${next}`);

            setScroll(next);
            setIsStuck(true);
        }

        setLastDeltaY(dy);
    });

    // Returns function to unstick the scroll
    return [scroll, unStick, lastDeltaY];
};
