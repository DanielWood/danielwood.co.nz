import { useCallback, useEffect, useRef, useState } from 'react';
import useEvent from '@react-hook/event';
import { useDebounce } from '@react-hook/debounce';
import Utils from '@/utils';

// Special thanks to Joel Teply for this idea
// https://stackoverflow.com/a/57781079/14496758
export const useIsTouchpad = () => {
    let counter = useRef<number>(0);
    let [isTouchpad, setIsTouchpad] = useState<boolean>(
        !!window.navigator.userAgent.match(/(Mobile)|(Mac OS)/i)
    );

    const handleWheel = (e: WheelEvent) => {
        const isMouse = e.deltaX === 0 && Number.isInteger(e.deltaY);
        counter.current += isMouse ? -1 : 1;
        if (Math.abs(counter.current) > 3) {
            setIsTouchpad(counter.current > 0);
            window.removeEventListener('wheel', handleWheel);
        }
    };

    useEffect(() => {
        window.addEventListener('wheel', handleWheel);
    }, []);

    return isTouchpad;
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
    const nudge = useRef(0);
    const scroll = useRef(0);
    const target = useRef(0);
    const maxDistY = useRef(0);
    const lastDeltaY = useRef(0);
    const dys = useRef<number[]>([]);

    const isTouchpad = useIsTouchpad();

    // We will return this function to the caller
    const getScroll = () => {
        target.current = Utils.clamp(Math.round(scroll.current), min, max);
        scroll.current = Utils.lerp(scroll.current, target.current + nudge.current, 0.05);
        nudge.current = Utils.lerp(nudge.current, 0, 0.1);
        return min + scroll.current * step;
    };

    useWheelY(fps, (dy) => {
        // Calibrate scroll distance
        if (Math.abs(dy) > maxDistY.current) {
            maxDistY.current = Math.abs(dy);
            return;
        }

        // Update deltas buffer
        dys.current.push(dy);
        if (dys.current.length >= 5) dys.current.shift();

        // Handle touchpad movement
        if (isTouchpad) {
            // Recalculate dy as a rolling average
            dy = dys.current.reduce((prev, cur) => prev + cur, 0) / dys.current.length;

            // Simple heuristic
            const didSpeedUp = Math.abs(dy) > Math.abs(lastDeltaY.current);
            if (didSpeedUp) {
                let scrollAmt = dy / maxDistY.current;
                nudge.current += scrollAmt;
            }
        }

        // Handle mouse wheel movement
        if (!isTouchpad) {
            let direction = dy / maxDistY.current;
            nudge.current += direction * 0.6;
        }

        lastDeltaY.current = dy;
    });

    // Returns function to unstick the scroll.current
    return [getScroll];
};
