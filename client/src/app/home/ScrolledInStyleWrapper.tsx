import React from 'react';
import cx from 'classnames';

const ScrolledInStyleWrapper = ({ scrollValue, targetValue, className, activeClasses, children, ...rest }) => (
    <div className={cx(className, { [activeClasses]: scrollValue === targetValue })} {...rest}>
        {children}
    </div>
);

export default ScrolledInStyleWrapper;
