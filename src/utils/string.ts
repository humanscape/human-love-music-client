export const secondsToString = (value: number) => {
  const minutes = Math.trunc(value / 60);
  const seconds = `0${value % 60}`.slice(-2);
  return `${minutes}:${seconds}`;
};

export const stringToSeconds = (value: string) => {
  const [minutes, seconds] = value.split(':');
  return parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
};
