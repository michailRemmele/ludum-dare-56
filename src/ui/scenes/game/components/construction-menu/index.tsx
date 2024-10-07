import {
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import type { FC, MouseEventHandler } from 'react';
import { SpriteRendererService, Actor } from 'remiz';

import {
  Money,
  Tier,
} from '../../../../../game/components';
import {
  CONSTRUCTION_SPOT_ID,
  BASE_TOWER_ID,
  AOE_TOWER_ID,
  FREEZE_TOWER_ID,
} from '../../../../../consts/templates';
import { EngineContext } from '../../../../providers';
import * as EventType from '../../../../../game/events';

import { UpgrageItem } from './upgrage-item';
import type { Tower, TierUpgrade } from './types';
import './style.css';

const SPOTS = [CONSTRUCTION_SPOT_ID, BASE_TOWER_ID, AOE_TOWER_ID, FREEZE_TOWER_ID];
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
const TIERS: Record<string, TierUpgrade[]> = {
  [BASE_TOWER_ID]: [
    {
      name: 'II',
      weapon: {
        damage: 25,
        range: 12,
      },
      cost: 50,
    },
    {
      name: 'III',
      weapon: {
        damage: 25,
        range: 12,
      },
      cost: 50,
    },
  ],
  [AOE_TOWER_ID]: [
    {
      name: 'II',
      weapon: {
        damage: 10,
        explosionRadius: 12,
      },
      cost: 100,
    },
    {
      name: 'III',
      weapon: {
        damage: 10,
        explosionRadius: 12,
      },
      cost: 100,
    },
  ],
  [FREEZE_TOWER_ID]: [
    {
      name: 'II',
      weapon: {
        damage: 5,
        explosionRadius: 12,
      },
      cost: 75,
    },
    {
      name: 'III',
      weapon: {
        damage: 5,
        explosionRadius: 12,
      },
      cost: 75,
    },
  ],
};
const PLAYER_ACTOR_NAME = 'Player';

const getNextTier = (actor: Actor): TierUpgrade | undefined => {
  const tier = actor.getComponent(Tier);
  return TIERS[actor.templateId!][tier.index];
};

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
      .find((actor) => {
        if (!actor.templateId) {
          return false;
        }
        if (SPOTS.includes(actor.templateId)) {
          return true;
        }

        const { parent } = actor;
        return parent instanceof Actor && parent.templateId && SPOTS.includes(parent.templateId);
      });

    if (!spot) {
      return;
    }

    spot.dispatchEvent(EventType.Select);
    setSelectedSpot(spot.parent instanceof Actor ? spot.parent : spot);
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

  const handleUpgrage = (tier: TierUpgrade): void => {
    if (!selectedSpot) {
      return;
    }

    selectedSpot.dispatchEvent(EventType.UpgradeTower, { ...tier });
    selectedSpot.dispatchEvent(EventType.Unselect);
    setSelectedSpot(undefined);
  };

  return (
    <div className="consturction-menu__overlay" onClick={handleClick}>
      {selectedSpot && (
        <div className="construction-menu" ref={menuRef}>
          {selectedSpot.templateId === CONSTRUCTION_SPOT_ID ? (
            <>
              <h4 className="consturction-menu__title">Build</h4>
              <div className="construction-menu__list">
                {TOWERS.map((tower) => (
                  <button
                    key={tower.id}
                    className="construction-menu__button"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleBuild(tower);
                    }}
                    disabled={money < tower.cost}
                  >
                    {tower.name[0]}
                    <span className="construction-menu__cost">
                      {tower.cost}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <UpgrageItem
              money={money}
              onClick={handleUpgrage}
              upgradeTier={getNextTier(selectedSpot)}
            />
          )}
        </div>
      )}
    </div>
  );
};
