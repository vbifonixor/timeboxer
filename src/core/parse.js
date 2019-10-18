import _get from "lodash/get";

import { nullTime } from "./helpers";

export default function parse(input) {
  return input
    .split("\n")
    .join("")
    .split("- ")
    .filter(Boolean)
    .map(entry => {
      const result = {};
      try {
        result.name = entry.match(/([a-zA-Z0-9, а-яА-Я]+):/)[1];
      } catch (e) {
        return null;
      }

      try {
        const timeSubstring = entry.match(/: ([\dhms]*)/)[1];

        const hours = Number(_get(timeSubstring.match(/(\d+)h/), "[1]", 0));
        const minutes = Number(_get(timeSubstring.match(/(\d+)m/), "[1]", 0));
        const seconds = Number(_get(timeSubstring.match(/(\d+)s/), "[1]", 0));

        if (hours > 99 || minutes >= 60 || seconds >= 60) {
          throw new Error();
        }

        if (hours === 0 && minutes === 0 && seconds === 0) {
          throw new Error();
        }

        result.time = nullTime
          .add(hours, "hours")
          .add(minutes, "minutes")
          .add(seconds, "seconds");
      } catch (e) {
        return null;
      }
      return result;
    })
    .filter(Boolean);
}
