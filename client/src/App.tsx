import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import StickyWheelProvider from '@/modules/StickyWheel';
import Navbar from '@/app/common/Navbar';
import Splash from '@/app/home/Splash';
import ComingSoon from '@/app/common/ComingSoon';

function App() {
    return (
        <div id="app" className="w-full h-screen absolute bg-gray-200">
            <StickyWheelProvider min={0} max={2}>
                {/* <Navbar locationPercent={wheel.target === 1 ? 12 : 50} /> */}
                <Router>
                    <Switch>
                        <Route path="/blog" component={ComingSoon} />
                        <Route path="/" component={Splash} />
                    </Switch>
                </Router>
            </StickyWheelProvider>
        </div>
    );
}

export default App;
