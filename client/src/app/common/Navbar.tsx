import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toPX from 'to-px';
import { Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';

const Navbar = ({ locationPercent = 50 }) => {
    const divRef = useRef<HTMLDivElement>(null!);

    const getCentered = (px: number) => px - divRef.current.offsetWidth / 2;
    const getPixel = (percent: number) => window.outerWidth * (locationPercent / 100);

    useEffect(() => {
        divRef.current.style.left = `${getCentered(getPixel(locationPercent))}px`;
    }, [locationPercent, window.outerWidth]);

    return (
        <div ref={divRef} className="absolute block transition-all duration-500">
            <h1 className="h-16 text-5xl text-gray-100 select-none text-center">
                {/* <Typist cursor={{ hideWhenDone: true, hideWhenDoneDelay: 0 }}> */}
                <span className="font-extrabold">DANIEL</span>
                <span className="font-hairline ml-1">WOOD</span>
                {/* </Typist> */}
            </h1>
            <div className="flex justify-between select-none">
                <Link
                    to="#"
                    className="w-1/3 mx-1 bg-gray-100 text-gray-700 text-center text-lg font-light tracking-tight"
                >
                    INTRO
                </Link>
                <Link
                    to="#"
                    className="w-1/3 mx-1 bg-gray-100 text-gray-700 text-center text-lg font-light tracking-tight"
                >
                    LINKS
                </Link>
                <Link
                    to="#"
                    className="w-1/3 mx-1 bg-gray-100 text-gray-700 text-center text-lg font-light tracking-tight"
                >
                    BLOG
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
