(window as any).global = window;
(window as any).process = {
  env: { DEBUG: undefined },
};
// @ts-ignore
if (global === undefined) { var global = window; }
