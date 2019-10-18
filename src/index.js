import React from "react";
import ReactDOM from "react-dom";

import connect from "storeon/react/connect";
import StoreContext from "storeon/react/context";
import { store } from "./core/store";

import b_ from "b_";

import { Howl } from "howler";

import Timer from "./components/timer";
import Input from "./components/input";

import "./styles.css";

const b = b_.lock("timeboxer");

class App extends React.Component {
  render() {
    return (
      <div className={b()}>
        {this._renderInput()}
        {this._renderTimers()}
      </div>
    );
  }

  _renderInput = () => {
    return <Input onChange={this._saveTimers} />;
  };

  _renderTimers = () => {
    return this.props.timers.map(timer => {
      const { name, timeLeft, isGoing, id } = timer;
      return (
        <Timer
          name={name}
          timeLeft={timeLeft}
          isGoing={isGoing}
          start={this._startTimer(id)}
          stop={this._stopTimer(id)}
        />
      );
    });
  };

  _saveTimers = parsed => {
    this.props.dispatch("timers/clean");
    parsed.map(parsedTimer => {
      this.props.dispatch("timers/create", {
        time: parsedTimer.time,
        name: parsedTimer.name,
        ring: this._beep
      });

      return parsedTimer;
    });
  };

  _startTimer = timerId => () => {
    this.props.dispatch("timers/start", timerId);
  };

  _stopTimer = timerId => () => {
    this.props.dispatch("timers/stop", timerId);
  };

  _beep() {
    new Howl({
      src: ["./static/mp3/beep.mp3"],
      autoplay: true
    });
  }
}

const ConnectedApp = connect(
  "timers",
  App
);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StoreContext.Provider value={store}>
    <ConnectedApp />
  </StoreContext.Provider>,
  rootElement
);
