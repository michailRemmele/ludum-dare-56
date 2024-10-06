import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import { EngineContext } from '../../../../providers';
import * as EventType from '../../../../../game/events';

import './style.css';

export const ProgressInfo: FC = () => {
  const { scene } = useContext(EngineContext);

  const [currentWave, setCurrentWave] = useState(0);

  useEffect(() => {
    const handleUpdate = (): void => {
      setCurrentWave((prev) => prev + 1);
    };

    scene.addEventListener(EventType.NextWave, handleUpdate);

    return (): void => {
      scene.removeEventListener(EventType.NextWave, handleUpdate);
    };
  }, []);

  return (
    <div className="progress-info">
      {`Wave: ${currentWave} / ${scene.data.totalWaves as number}`}
    </div>
  );
};
