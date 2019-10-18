import createStore from "storeon";

import { timerBox } from "../boxes/timer";

export const store = createStore([
  timerBox,
  require("storeon/devtools/logger")
]);
