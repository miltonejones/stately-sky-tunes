export const css = (o) =>
  Object.keys(o)
    .filter((f) => !!o[f])
    .join(" ");