import React from "react";
import b_ from "b_";

const b = b_.lock("timer");

const Timer = ({ name, timeLeft, isGoing, start, stop }) => {
  console.log(timeLeft.format("HH:mm:ss"));
  return (
    <div className={b()}>
      <div className={b("caption")}>{name}</div>
      <div className={b("time")}>{timeLeft.format("HH:mm:ss")}</div>
      <div className={b("actions")}>
        {!isGoing ? (
          <span className={b("start")} onClick={start}>
            |>
          </span>
        ) : (
          <span className={b("stop")} onClick={stop}>
            □
          </span>
        )}
      </div>
    </div>
  );
};

export default Timer;
