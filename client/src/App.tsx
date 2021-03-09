import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Splash from '@/app/home/Splash';
import ComingSoon from '@/app/common/ComingSoon';

function App() {
    return (
        <div id="app">
            <Router>
                <Switch>
                    <Route path="/blog" component={ComingSoon} />
                    <Route path="/" component={Splash} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
