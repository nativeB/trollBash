import React from "react";
import "./assets/App.css";

function Divs(prop) {
    return (
        <div
            className={[
                "boxes",
                prop.i === prop.startAt ? "boxes-show" : "boxes-hide",
                prop.hit === prop.i && prop.hit === prop.startAt
                    ? "boxes-win"
                    : "boxes-nowin"
            ].join(" ")}
            onClick={() => {
                prop.handleClick(prop.i);
            }}
        />
    );
}
function Score(prop) {
    return (
        <div
            className={["score", prop.start ? "colorStart" : "colorStop"].join(" ")}
        >
            {prop.hits}{" "}
        </div>
    );
}
function Speed(prop) {
    return (
        <div className="score">
            <label htmlFor="speed">speed </label>
            <input
                type="number"
                id="speed"
                value={prop.timeout}
                onChange={e => {
                    prop.handleSpeed(e);
                }}
            />{" "}
            ms
        </div>
    );
}
function Timer(prop) {
    return (
        <div className="score">
            <span>{prop.eta} s</span>
        </div>
    );
}
function Controls(prop) {
    return (
        <div className="score">
            <button
                onClick={() => {
                    prop.start();
                }}
            >
                Start
            </button>
            <button
                onClick={() => {
                    prop.stop();
                }}
            >
                Stop
            </button>
            <button
                onClick={() => {
                    prop.setdynamic();
                }}
            >
                {prop.dynamic ? "static" : "dynamic"}
            </button>
        </div>
    );
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            startAt: 39,
            size: 40,
            timeout: 1000,
            timeoutfn: null,
            hit: null,
            hits: 0,
            dynamic: false,
            start: false,
            eta: 0
        };
    }
    render() {
        const boxes = [];

        if (this.state.start)
            for (let i = 0; i <= this.state.size; i++) {
                boxes.push(
                    <Divs
                        key={i}
                        i={i}
                        startAt={this.state.startAt}
                        hit={this.state.hit}
                        handleClick={this.handleClick}
                    />
                );
            }
        return (
            <div className="App">
                <h2>Troll basher</h2>
                <div className="menu">
                    <Controls
                        start={this.start}
                        stop={this.stop}
                        setdynamic={this.setdynamic}
                        dynamic={this.state.dynamic}
                    />
                    <Speed handleSpeed={this.handleSpeed} timeout={this.state.timeout} />
                    <Timer eta={this.state.eta} />
                    <Score hits={this.state.hits} start={this.state.start} />
                </div>
                <div className="box-container"> {boxes} </div>
            </div>
        );
    }
    rand(num) {
        return Math.floor(Math.random() * num);
    }
    changePos() {
        if (!this.state.hit) this.setState({ startAt: this.rand(this.state.size) });
        setTimeout(() => {
            this.changePos();
        }, this.state.timeout);
    }
    handleClick = e => {
        if (this.state.start) {
            if (e === this.state.startAt)
                this.setState({ hits: this.state.hits + 1 });
            this.setState({ hit: e });
            setTimeout(() => {
                this.setState({ hit: null });
            }, 100);
        }
    };
    handleSpeed = e => {
        this.setState({ timeout: Math.abs(e.target.value) });
    };
    start = () => {
        if (!this.state.start) {
            this.setState({ start: true, hits: 0, eta: 0 });
            this.changePos();
            this.time();
        }
    };
    stop = () => {
        this.setState({ start: false });
    };
    setdynamic = () => {
        this.setState({ dynamic: !this.state.dynamic });
    };
    time() {
        setTimeout(() => {
            this.setState({ eta: this.state.eta + 1 });
            if (this.state.eta === 60) return this.stop();
            if (this.state.start) this.time();
            if (this.state.dynamic) this.dynamic();
        }, 1000);
    }
    dynamic = () => {
        this.setState({ timeout: this.rand(5000) });
    };

    componentDidMount() {
        if (this.state.start)
            setTimeout(() => {
                this.changePos();
            }, this.state.timeout);
    }
}

export default App;
