import React from 'react';
import cx from 'classnames';

const DownArrow = ({ width = 20 }) => (
    <svg viewBox="0 0 30 10" width={width} className="mx-auto animate-bounce">
        <path className="stroke-2" d="M0 -1 L15 8 L30 -1" />
    </svg>
);

const ScrollCue = ({ className: extraClasses = '' }) => (
    <div className={cx('text-gray-100 stroke-current fill-transparent items-center flex flex-col', extraClasses)}>
        <DownArrow width={20} />
        <DownArrow width={20} />
        <DownArrow width={20} />
        <h1 className="mt-1 text-xs font-normal animate-pulse">SCROLL</h1>
    </div>
);

export default ScrollCue;
