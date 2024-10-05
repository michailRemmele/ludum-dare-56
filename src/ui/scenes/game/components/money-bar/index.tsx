import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import { EngineContext } from '../../../../providers';
import * as EventType from '../../../../../game/events';
import type { MoneyUpdateEvent } from '../../../../../game/events';

import './style.css';

export const MoneyBar: FC = () => {
  const { scene } = useContext(EngineContext);

  const [value, setValue] = useState(0);

  useEffect(() => {
    const handleUpdate = (event: MoneyUpdateEvent): void => {
      setValue(event.money);
    };

    scene.addEventListener(EventType.MoneyUpdate, handleUpdate);

    return (): void => {
      scene.removeEventListener(EventType.MoneyUpdate, handleUpdate);
    };
  }, []);

  return (
    <div className="money-bar">
      {value}
    </div>
  );
};
