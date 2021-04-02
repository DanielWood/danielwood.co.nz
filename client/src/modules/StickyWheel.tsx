import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useThrottle } from '@react-hook/throttle';
import Utils from '@/utils';
import { useFrame } from 'react-three-fiber';

class StickyWheel {
    public target: number;
    public scroll: number;
    public isTouchpad: boolean;
    public nudge: number = 0;
    private _maxDistY: number = 0;
    private _lastDeltaY: number = 0;
    private _lastTick: DOMHighResTimeStamp;
    private _dys: number[] = [];
    private _inferCounter = 0;

    constructor(
        public readonly min: number,
        public readonly max: number,
        public readonly speed: number,
        public readonly damping: number,
        public readonly wheelFactor: number,
        private readonly _inferMouseMs: number = 10000
    ) {
        this.target = min;
        this.scroll = min;
        this.isTouchpad = !!window.navigator.userAgent.match(/(Mobile)|(Mac OS)/i);
        this._lastTick = performance.now();
        window.requestAnimationFrame(this._tick);
        window.addEventListener('wheel', this._handler);
        window.addEventListener('wheel', this._inferMouseType);
    }

    private _tick = (t: DOMHighResTimeStamp) => {
        const deltaSec = (t - this._lastTick) / 1000;
        this._lastTick = t;

        const nextTarget = Utils.clamp(Math.round(this.scroll), this.min, this.max);
        this.target = nextTarget;

        this.scroll = Utils.lerp(this.scroll, nextTarget + this.nudge, this.speed * deltaSec);
        this.nudge = Utils.lerp(this.nudge, 0, this.damping * deltaSec);

        window.requestAnimationFrame(this._tick);
    };

    private _handler = (e: WheelEvent) => {
        var dy = e.deltaY;

        // Calibrate scroll distance
        if (Math.abs(dy) > this._maxDistY) {
            this._maxDistY = Math.abs(dy);
            return;
        }

        // Update deltas buffer
        this._dys.push(dy);
        if (this._dys.length >= 5) this._dys.shift();

        // Handle touchpad movement
        if (this.isTouchpad) {
            // Recalculate dy as a moving average
            dy = this._dys.reduce((prev, cur) => prev + cur, 0) / this._dys.length;

            const didSpeedUp = Math.abs(dy) > Math.abs(this._lastDeltaY);
            if (didSpeedUp) {
                let scrollAmt = dy / this._maxDistY;
                this.nudge += scrollAmt;
            }
        }

        // Handle mouse wheel movement
        if (!this.isTouchpad) {
            let direction = dy / this._maxDistY;
            this.nudge += direction * this.wheelFactor;
        }

        this._lastDeltaY = dy;
    };

    // Touchpad heuristics
    private _inferMouseType = (e: WheelEvent) => {
        const isMouse = e.deltaX === 0 && Number.isInteger(e.deltaY);
        this._inferCounter += isMouse ? -1 : 1;
        if (Math.abs(this._inferCounter) > 3) {
            this.isTouchpad = this._inferCounter > 0;
            window.removeEventListener('wheel', this._inferMouseType);
            // Run again after set interval
            if (this._inferMouseMs > 0) {
                window.setTimeout(
                    () => void window.addEventListener('wheel', this._inferMouseType),
                    this._inferMouseMs
                );
            }
        }
    };
}

const StickyWheelContext = React.createContext(null);
const StickyWheelProvider = function ({
    min,
    max,
    step = 1,
    speed = 2,
    damping = 5,
    wheelFactor = 0.2,
    fps = 2,
    inferMouseMs = 10000,
    children,
}) {
    const wheel = useMemo(() => new StickyWheel(min, max, speed, damping, wheelFactor, inferMouseMs), []);

    // React state (for passing in props)
    const [state, setState] = useThrottle(
        {
            target: wheel.target,
            scroll: wheel.scroll,
            nudge: wheel.nudge,
            isTouchpad: wheel.isTouchpad,
        },
        fps
    );

    // Update react state
    useEffect(() => {
        const tick = () => {
            setState({ target: wheel.target, scroll: wheel.scroll, nudge: wheel.nudge, isTouchpad: wheel.isTouchpad });
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });

    // Real-time accessors (use these inside render loops)
    const getScroll = () => wheel.scroll;
    const getNudge = () => wheel.nudge;
    const getTarget = () => wheel.target;
    const getIsTouchpad = () => wheel.isTouchpad;

    return (
        <StickyWheelContext.Provider value={{ ...state, getScroll, getNudge, getTarget, getIsTouchpad }}>
            {children}
        </StickyWheelContext.Provider>
    );
};

export interface StickyWheelState {
    // Real time accessors (use these inside render loops)
    getScroll: () => number;
    getNudge: () => number;
    getTarget: () => number;
    getIsTouchpad: () => boolean;

    // Stateful variables (pass these in props)
    scroll: number;
    nudge: number;
    target: number;
    isTouchpad: boolean;
}

export const useStickyWheel = () => {
    const context = useContext<StickyWheelState>(StickyWheelContext);
    if (context === null) {
        throw new Error('useStickyWheel must be called within a StickyWheelProvider');
    }
    return context;
};

export default StickyWheelProvider;
