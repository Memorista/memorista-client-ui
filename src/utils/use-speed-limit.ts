import { useEffect, useRef, useState } from 'preact/hooks';

const useSpeedLimit = (minTimeSeconds: number) => {
  const timeoutHandle = useRef<number>();
  const [minTimeElapsed, setMinTimeElapsed] = useState<boolean>(false);

  useEffect(() => {
    timeoutHandle.current = window.setTimeout(() => setMinTimeElapsed(true), minTimeSeconds * 1000);

    return () => {
      if (timeoutHandle.current) {
        clearTimeout(timeoutHandle.current);
      }
    };
  }, []);

  return minTimeElapsed;
};

export default useSpeedLimit;
