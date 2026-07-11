import { useEffect, useState } from 'react';

export const useNotSSR = () => {
  const [notSSR, setNotSSR] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotSSR(true);
  }, []);
  return notSSR;
};
