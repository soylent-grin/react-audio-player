"use strict";

let React = require('react');
import AudoiPlayer from './components/audio-player.react';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            track: "/audio/never.mp3"
        };
    }
    componentDidMount() {
        // uncomment this to check outer component manipulation
        /*setTimeout(() => {
            this.setState({
                track: "/audio/never.mp4"
            });
        }, 5000);*/
    }
    render() {
        return <AudoiPlayer track={this.state.track}/>
    }
}

React.render(
    <App />,
    document.getElementById('main-wrapper')
);