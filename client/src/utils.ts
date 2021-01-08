// Utilities
export default {
    clamp: (value: number, min: number, max: number) => {
        return Math.min(Math.max(value, min), max);
    },
    lerp: (from: number, to: number, t: number) => {
        return (1 - t) * from + t * to;
    },
};
