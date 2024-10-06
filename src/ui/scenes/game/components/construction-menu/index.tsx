import {
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import type { FC, MouseEventHandler } from 'react';
import { SpriteRendererService } from 'remiz';
import type { Actor } from 'remiz';

import { Money } from '../../../../../game/components';
import {
  CONSTRUCTION_SPOT_ID,
  BASE_TOWER_ID,
  AOE_TOWER_ID,
  FREEZE_TOWER_ID,
} from '../../../../../consts/templates';
import { EngineContext } from '../../../../providers';
import * as EventType from '../../../../../game/events';

import './style.css';

type Tower = {
  id: string
  name: string
  cost: number
};

const TOWERS: Tower[] = [
  {
    id: BASE_TOWER_ID,
    name: 'base',
    cost: 50,
  },
  {
    id: AOE_TOWER_ID,
    name: 'aoe',
    cost: 100,
  },
  {
    id: FREEZE_TOWER_ID,
    name: 'freeze',
    cost: 75,
  },
];
const PLAYER_ACTOR_NAME = 'Player';

export const ConstructionMenu: FC = () => {
  const { scene } = useContext(EngineContext);

  const menuRef = useRef<HTMLDivElement>(null);

  const [selectedSpot, setSelectedSpot] = useState<Actor | undefined>();
  const [money, setMoney] = useState<number>(0);

  useEffect(() => {
    const handleUpdateMoney = (): void => {
      const player = scene.getEntityByName(PLAYER_ACTOR_NAME);
      const moneyComponent = player?.getComponent(Money);

      setMoney(moneyComponent?.value ?? 0);
    };

    handleUpdateMoney();

    scene.addEventListener(EventType.MoneyUpdate, handleUpdateMoney);
    return (): void => scene.removeEventListener(EventType.MoneyUpdate, handleUpdateMoney);
  }, []);

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (selectedSpot && !menuRef.current?.contains(event.target as HTMLDivElement)) {
      selectedSpot.dispatchEvent(EventType.Unselect);
      setSelectedSpot(undefined);
      return;
    }

    const { clientX, clientY } = event;

    const rendererService = scene.getService(SpriteRendererService);
    const spot = rendererService.intersectsWithPoint(clientX, clientY)
      .find((actor) => actor.templateId === CONSTRUCTION_SPOT_ID);

    if (!spot) {
      return;
    }

    spot.dispatchEvent(EventType.Select);
    setSelectedSpot(spot);
  };

  const handleBuild = (tower: Tower): void => {
    if (!selectedSpot) {
      return;
    }

    scene.dispatchEvent(EventType.BuildTower, {
      id: tower.id,
      cost: tower.cost,
      spotId: selectedSpot.id,
    });
    selectedSpot.dispatchEvent(EventType.Unselect);
    setSelectedSpot(undefined);
  };

  return (
    <div className="consturction-menu__overlay" onClick={handleClick}>
      {selectedSpot && (
        <div className="construction-menu" ref={menuRef}>
          <h4 className="consturction-menu__title">Build</h4>
          <div className="construction-menu__list">
            {TOWERS.map((tower) => (
              <button
                key={tower.id}
                className="construction-menu__button"
                type="button"
                onClick={() => handleBuild(tower)}
                disabled={money < tower.cost}
              >
                {tower.name[0]}
                <span className="construction-menu__cost">
                  {tower.cost}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
