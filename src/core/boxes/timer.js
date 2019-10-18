import uuid from "uuid/v4";

import { nullTime } from "../helpers";

const INIT = "@init";

const CREATE = "timers/create";
const CLEAN = "timers/clean";
const START = "timers/start";
const STOP = "timers/stop";

const _TICK = "timers/_tick";
const _SET_GOING = "timers/_set_going";
const _UNSET_GOING = "timers/_unset_going";
const _RING = "timers/_ring";

let timerBox = store => {
  const getTimerClone = (timers, id) => {
    const selectedTimer = timers.find(timer => timer.id === id);

    if (!selectedTimer) return null;

    return { ...selectedTimer };
  };

  store.on(INIT, () => ({ timers: [] }));

  store.on(CREATE, ({ timers }, { time, name, ring }) => {
    const newTimer = {
      id: uuid(),
      timeLeft: time,
      initialTime: time,
      name,
      ring
    };

    return {
      timers: [...timers, newTimer]
    };
  });

  store.on(CLEAN, () => ({
    timers: []
  }));

  store.on(START, (_, timerId) => {
    store.dispatch(_SET_GOING, timerId);
    setTimeout(() => store.dispatch(_TICK, timerId), 1000);
  });

  store.on(_SET_GOING, ({ timers }, timerId) => {
    const selectedTimer = getTimerClone(timers, timerId);

    if (!selectedTimer || selectedTimer.isGoing) {
      return;
    }

    selectedTimer.isGoing = true;

    return {
      timers: [...timers.filter(timer => timer.id !== timerId), selectedTimer]
    };
  });

  store.on(_UNSET_GOING, ({ timers }, timerId) => {
    const selectedTimer = getTimerClone(timers, timerId);

    if (!selectedTimer) {
      return;
    }

    selectedTimer.timeLeft = selectedTimer.initialTime;
    selectedTimer.isGoing = false;

    return {
      timers: [...timers.filter(timer => timer.id !== timerId), selectedTimer]
    };
  });

  store.on(_RING, ({ timers }, timerId) => {
    const selectedTimer = getTimerClone(timers, timerId);

    if (!selectedTimer) {
      return;
    }

    store.dispatch(_UNSET_GOING, timerId);
    selectedTimer.ring();
  });

  store.on(STOP, (_, timerId) => {
    store.dispatch(_UNSET_GOING, timerId);
  });

  store.on(_TICK, ({ timers }, timerId) => {
    const selectedTimer = getTimerClone(timers, timerId);

    if (!selectedTimer || !selectedTimer.isGoing) {
      return;
    }

    selectedTimer.timeLeft = selectedTimer.timeLeft.subtract(1, "seconds");

    setTimeout(() => store.dispatch(_TICK, timerId), 1000);

    if (
      selectedTimer.timeLeft.isSame(nullTime) ||
      selectedTimer.timeLeft.isBefore(nullTime)
    ) {
      store.dispatch(_RING, timerId);
      return;
    }

    return {
      timers: [...timers.filter(timer => timer.id !== timerId), selectedTimer]
    };
  });
};

export { timerBox };
