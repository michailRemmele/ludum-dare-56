import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import { Money } from '../../../../../game/components';
import { EngineContext } from '../../../../providers';
import * as EventType from '../../../../../game/events';
import type { MoneyUpdateEvent } from '../../../../../game/events';

import './style.css';

const PLAYER_ACTOR_NAME = 'Player';

export const MoneyBar: FC = () => {
  const { scene } = useContext(EngineContext);

  const [value, setValue] = useState(() => {
    const player = scene.getEntityByName(PLAYER_ACTOR_NAME);
    return player?.getComponent(Money)?.value ?? 0;
  });

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
      <div className="money-bar__inner">
        <img src="./images/money_icon.png" alt="" />
        <span className="money-bar__value">{value}</span>
      </div>
    </div>
  );
};
