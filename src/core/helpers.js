import dayjs from "dayjs";

export const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

export const nullTime = dayjs(timezoneOffset);
