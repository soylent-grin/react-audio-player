"use strict";

let React = require('react');

const UPADTE_INTERVAL = 1000;

export default class AudioPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            muted: false,
            paused: true,
            duration: 0,
            currentTime: 0
        }
    }
    componentDidMount() {
        this.initTrack(this.props.track);
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.track !== this.props.track) {
            this.initTrack(nextProps.track);
        // }
    }

    handlePlayPauseClick() {
        this.setState({
            paused: !this.state.paused
        }, () => {
            this.state.paused ? this.audio.pause() : this.audio.play();
        })
    }
    handleMuteClick() {
        this.setState({
            muted: !this.state.muted
        }, () => {
            this.audio.muted = this.state.muted;
        })
    }
    handleRangeChange(e) {
        if (this.audio) {
            this.audio.currentTime = this.refs.range.getDOMNode().value;
        }
    }
    handleRangeKeyUp() {
        this.updateTiming();
    }

    initTrack(track) {
        if (this.audio) {
            this.audio.pause();
        }
        this.audio = new Audio(track);
        this.setState({
            paused: true
        }, () => {
            this.updateTiming(() => {
                if (this.updateInterval) {
                    clearInterval(this.updateInterval);
                }
                this.updateInterval = setInterval(() => {
                    this.updateTiming();
                }, UPADTE_INTERVAL);
            });
        });
    }
    updateTiming(callback) {
        this.setState({
            duration: this.audio.duration,
            currentTime: this.audio.currentTime
        }, callback);
    }

    renderTiming() {
        if (isNaN(this.state.duration) || this.state.duration === 0) {
            return;
        }
        let remaining = this.state.duration - this.state.currentTime;
        let minutes = Math.floor(remaining / 60);
        let seconds = Math.floor(remaining % 60);
        return (
            <span className="audio-player__timing">
                -{minutes}:{seconds < 10 ? "0" + seconds.toString() : seconds}
            </span>
        );
    }

    render() {
        return (
            <div className="audio-player">
                <div className="audio-player__navigation">
                    <span className="audio-player__track-name">
                        {this.props.track}
                    </span>
                    {this.renderTiming()}
                    <input type="range"
                        ref="range"
                        disabled={this.duration === 0}
                        min="0"
                        max={this.state.duration}
                        value={this.state.currentTime}
                        onClick={this.handleRangeKeyUp.bind(this)}
                        onChange={this.handleRangeChange.bind(this)}/>
                </div>
                <div className="audio-player__controls">
                    <button className="audio-player__button audio-player__button--play"
                        onClick={this.handlePlayPauseClick.bind(this)}
                        title={this.state.paused ? "Resume" : "Pause"}>
                        {
                            this.state.paused ?
                                <i className="fa fa-play"></i>:
                                <i className="fa fa-pause"></i>
                        }
                    </button>
                    <button className="audio-player__button audio-player__button--mute"
                        onClick={this.handleMuteClick.bind(this)}
                        title={this.state.muted ? "Turn sound on" : "Turn sound off"}>
                        {
                            this.state.muted ?
                                <i className="fa fa-volume-off"></i>:
                                <i className="fa fa-volume-up"></i>
                        }
                    </button>
                </div>
            </div>
        );
    }
}