function cache(durationSecs = 60) {
  let stored = void 0;
  let timeout = void 0;
  return {
    get: () => stored,
    set: (value) => {
      if (timeout)
        clearTimeout(timeout);
      stored = value;
      timeout = setTimeout(() => stored = void 0, durationSecs * 60);
      return value;
    }
  };
}
export { cache as c };
