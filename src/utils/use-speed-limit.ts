import React from 'react';

const useSpeedLimit = (minTimeSeconds: number) => {
  const timeoutHandle = React.useRef<number>();
  const [minTimeElapsed, setMinTimeElapsed] = React.useState<boolean>(false);

  React.useEffect(() => {
    timeoutHandle.current = setTimeout(() => setMinTimeElapsed(true), minTimeSeconds * 1000);

    return () => {
      if (timeoutHandle.current) {
        clearTimeout(timeoutHandle.current);
      }
    };
  }, []);

  return minTimeElapsed;
};

export default useSpeedLimit;
