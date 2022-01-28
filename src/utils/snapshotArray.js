export const snapshotToArray = (snap) =>
  Object.entries(snap).map((e) => Object.assign(e[1], { key: e[0] }));
