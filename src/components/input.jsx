import React from "react";
import b_ from "b_";

import parse from "../core/parse";

const b = b_.lock("input");

const parseAndDeliver = callback => evt => callback(parse(evt.target.value));

const Input = ({ onChange }) => {
  return <textarea className={b()} onChange={parseAndDeliver(onChange)} />;
};

export default Input;
