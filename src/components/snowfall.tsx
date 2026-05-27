import Snowfall from 'react-snowfall';
import { useUIStore } from '../context/index';

export const SnowfallEffect = () => {
  const { screenState } = useUIStore();
  if (screenState === 'welcome') return null;
  return (
    <Snowfall
      color="#e1c6acff"
      snowflakeCount={500}
      wind={[-1, 1]}
      radius={[1, 4]}
      speed={[1, 3]}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        opacity: 0.8,
      }}
    />
  );
};
