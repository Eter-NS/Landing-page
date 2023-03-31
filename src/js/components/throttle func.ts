export default function throttle(callback: Function, delay: number = 1000) {
  let shouldWait = false;
  let waitingArgs: unknown[] | null;
  const delayTime = Math.floor(delay);

  return (...args: unknown[]) => {
    if (shouldWait) {
      waitingArgs = args;
      return;
    }

    callback(...args);
    shouldWait = true;

    setTimeout(timeoutFunc, delayTime);
  };

  // closure
  function timeoutFunc() {
    if (waitingArgs == null) {
      shouldWait = false;
    } else {
      callback(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutFunc, delayTime);
    }
  }
}
