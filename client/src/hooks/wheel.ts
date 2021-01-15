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

export interface StickyWheelContext {
    getScroll: () => number;
    getTarget: () => number;
    getNudge: () => number;
    isTouchpad: boolean;
}

export const useStickyWheel = (
    min: number,
    max: number,
    step: number = 1,
    speed: number = 2,
    damping: number = 5,
    wheelFactor: number = 0.2,
    fps: number = 60
): StickyWheelContext => {
    const nudge = useRef(0);
    const scroll = useRef(0);
    const target = useRef(0);
    const maxDistY = useRef(0);
    const lastDeltaY = useRef(0);
    const dys = useRef<number[]>([]);

    const isTouchpad = useIsTouchpad();

    const lastTick = useRef<number>(null!);
    const tick = (t) => {
        const deltaSec = (t - lastTick.current || 0) / 1000;
        lastTick.current = t;

        // Round target to nearest integer
        target.current = Utils.clamp(Math.round(scroll.current), min, max);

        // Lerp scroll value to target
        scroll.current = Utils.lerp(
            scroll.current,
            target.current + nudge.current,
            speed * deltaSec
        );

        // Dampen nudge
        nudge.current = Utils.lerp(nudge.current, 0, damping * deltaSec);

        window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);

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
            // Recalculate dy as a moving average
            dy = dys.current.reduce((prev, cur) => prev + cur, 0) / dys.current.length;

            const didSpeedUp = Math.abs(dy) > Math.abs(lastDeltaY.current);
            if (didSpeedUp) {
                let scrollAmt = dy / maxDistY.current;
                nudge.current += scrollAmt;
            }
        }

        // Handle mouse wheel movement
        if (!isTouchpad) {
            let direction = dy / maxDistY.current;
            nudge.current += direction * wheelFactor;
        }

        lastDeltaY.current = dy;
    });

    return {
        getScroll: () => min + scroll.current * step,
        getTarget: () => target.current,
        getNudge: () => nudge.current,
        isTouchpad,
    };
};
