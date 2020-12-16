import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import actions from './redux/actions';
import {RootState} from 'typesafe-actions';

const mapStateToProps = ({ home }: RootState) => ({
    isSplashOpen: home.isSplashOpen,
});

const mapDispatchToProps = {
    closeSplash: actions.closeSplash
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps;

const Splash = ({}) => (
    <div>
        <h1>Loading...</h1>
    </div>
);

export default connector(Splash);