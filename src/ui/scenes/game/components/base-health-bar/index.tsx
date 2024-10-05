import { useContext, useState, useEffect } from 'react';
import type { FC } from 'react';

import { BASE_ID } from '../../../../../consts/templates';
import { Health } from '../../../../../game/components';
import { EngineContext } from '../../../../providers';
import * as EventType from '../../../../../game/events';
import type { DamageEvent } from '../../../../../game/events';

import './style.css';

export const BaseHealthBar: FC = () => {
  const { scene } = useContext(EngineContext);

  const [points, setPoints] = useState(100);
  const [maxPoints, setMaxPoints] = useState(100);

  useEffect(() => {
    const handleUpdate = (event: DamageEvent): void => {
      const { target } = event;

      if (target.templateId === BASE_ID) {
        const health = target.getComponent(Health);
        setPoints(health.points);
        setMaxPoints(health.maxPoints);
      }
    };

    scene.addEventListener(EventType.Damage, handleUpdate);

    return (): void => {
      scene.removeEventListener(EventType.Damage, handleUpdate);
    };
  }, []);

  return (
    <div className="health-bar">
      <div
        className="health-bar__points"
        style={{ width: `${maxPoints ? ((points / maxPoints) * 100) : 0}%` }}
      />
    </div>
  );
};
