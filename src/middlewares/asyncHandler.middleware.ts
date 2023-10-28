export const asyncHandler =
  (fn: (...args: any[]) => any) =>
  (...args: any[]) =>
    Promise.resolve(fn(...args)).catch(args[args.length - 1]);
