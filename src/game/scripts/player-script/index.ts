import type {
  Actor,
  ActorSpawner,
  Scene,
  ScriptOptions,
} from 'remiz';
import {
  Script,
  Camera,
  Transform,
} from 'remiz';

import { Money } from '../../components';
import * as EventType from '../../events';
import type { BuildTowerEvent, EnemyDeathEvent } from '../../events';

const MONEY_PER_ENEMY = 10;
const VIEWPORT_SIZE = 480;

export class PlayerScript extends Script {
  private actor: Actor;
  private actorSpawner: ActorSpawner;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.actorSpawner = options.actorSpawner;
    this.scene = options.scene;

    this.scene.addEventListener(EventType.EnemyDeath, this.handleEnemyDeath);
    this.scene.addEventListener(EventType.BuildTower, this.handleTowerBuild);
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.EnemyDeath, this.handleEnemyDeath);
    this.scene.removeEventListener(EventType.BuildTower, this.handleTowerBuild);
  }

  private handleEnemyDeath = (event: EnemyDeathEvent): void => {
    if (event.withoutReward) {
      return;
    }

    const money = this.actor.getComponent(Money);
    money.value += MONEY_PER_ENEMY;
    this.scene.dispatchEvent(EventType.MoneyUpdate, { money: money.value });
  };

  private handleTowerBuild = (event: BuildTowerEvent): void => {
    const { id, spotId, cost } = event;

    const money = this.actor.getComponent(Money);

    if (money.value < cost) {
      return;
    }

    money.value -= cost;

    const tower = this.actorSpawner.spawn(id);
    const spot = this.scene.getEntityById(spotId);

    if (!spot) {
      return;
    }

    const towerTransform = tower.getComponent(Transform);
    const spotTransform = spot.getComponent(Transform);

    towerTransform.offsetX = spotTransform.offsetX;
    towerTransform.offsetY = spotTransform.offsetY;

    spot?.remove();
    this.scene.appendChild(tower);

    this.scene.dispatchEvent(EventType.MoneyUpdate, { money: money.value });
  };

  private updateZoom(): void {
    const camera = this.actor.getComponent(Camera);
    camera.zoom = Math.min(camera.windowSizeX / VIEWPORT_SIZE, camera.windowSizeY / VIEWPORT_SIZE);
  }

  update(): void {
    this.updateZoom();
  }
}

PlayerScript.scriptName = 'PlayerScript';
