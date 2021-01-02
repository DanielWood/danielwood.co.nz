import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Splash from '@/app/home/Splash';

function App() {
    return (
        <div id="app">
            <Router>
                <Splash />
            </Router>
        </div>
    );
}

export default App;
