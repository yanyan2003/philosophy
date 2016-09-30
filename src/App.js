import React from 'react';

import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Philosophy from './Philosophy.js';

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div className="App">
                    <div className="App-header">
                        <h1>Getting to Philosophy</h1>
                    </div>
                    <Philosophy />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
