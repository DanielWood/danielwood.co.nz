import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Splash from '@/app/home/Splash';
import ThreeDemo from '@/app/home/ThreeDemo';

function App() {
    return (
        <div id="app">
            <Router>
                <Splash />
                {/* <ThreeDemo /> */}
            </Router>
        </div>
    );
}

export default App;
