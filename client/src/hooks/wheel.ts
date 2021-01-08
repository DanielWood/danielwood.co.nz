import { useCallback, useEffect, useState } from 'react';
import useEvent from '@react-hook/event';
import { useDebounce } from '@react-hook/debounce';
import Utils from '@/utils';

// Special thanks to Joel Teply for this idea
// https://stackoverflow.com/a/57781079/14496758
export const useHasTrackpad = () => {
    let [isTrackpadCounts, setIsTrackpadCounts] = useState<number>(0);
    let [isTrackpad, setIsTrackpad] = useState<boolean>(
        !!window.navigator.userAgent.match(/(Mobile)|(Mac OS)/i)
    );

    const handleWheel = (e: WheelEvent) => {
        const isMouse = e.deltaX === 0 && Number.isInteger(e.deltaY);
        isTrackpadCounts += isMouse ? -1 : 1;
        if (Math.abs(isTrackpadCounts) > 3) {
            setIsTrackpad(isTrackpadCounts > 0);
            window.removeEventListener('wheel', handleWheel);
        }
    };

    // Register wheel event listener
    useEffect(() => {
        window.addEventListener('wheel', handleWheel);
    }, []);

    return isTrackpad;
};

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
): [() => number] => {
    const [lastDeltaY, setLastDeltaY] = useState<number>(0);
    const [maxDistY, setMaxDistY] = useState<number>(0);
    const [target, setTarget] = useState<number>(0);
    const [scroll, setScroll] = useState<number>(0);
    const [lastDeltas] = useState<number[]>([]);
    const [nudge, setNudge] = useState<number>(0);

    const getIsTrackpad = useHasTrackpad();

    // We will return this function to the caller
    const getScroll = () => {
        setTarget(Utils.clamp(Math.round(scroll), min, max));
        setScroll(Utils.lerp(scroll, target + nudge, 0.05));
        setNudge(Utils.lerp(nudge, 0, 0.1));
        return min + scroll * step;
    };

    useWheelY(fps, (dy) => {
        // Calibrate scroll distance
        if (Math.abs(dy) > maxDistY) {
            setMaxDistY(Math.abs(dy));
            return;
        }

        // Update deltas buffer
        lastDeltas.push(dy);
        if (lastDeltas.length >= 5) lastDeltas.shift();

        // Handle trackpad movement
        const isTrackpad = getIsTrackpad;
        // console.log(isTrackpad);
        if (isTrackpad) {
            // Recalculate dy as a rolling average
            dy = lastDeltas.reduce((prev, cur) => prev + cur, 0) / lastDeltas.length;

            // Simple heuristic
            const didSpeedUp = Math.abs(dy) > Math.abs(lastDeltaY);
            if (didSpeedUp) {
                let scrollAmt = dy / maxDistY;
                setNudge(nudge + scrollAmt);
                console.log(nudge);
            }
        }

        // Handle mouse wheel movement
        if (!isTrackpad) {
            let direction = dy / maxDistY;
            setNudge(nudge + direction * 0.6);
            console.log(nudge);
        }

        setLastDeltaY(dy);
    });

    // Returns function to unstick the scroll
    return [getScroll];
};
