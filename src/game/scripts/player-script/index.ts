import type {
  Actor,
  Scene,
  ScriptOptions,
} from 'remiz';
import {
  Script,
} from 'remiz';

import { Money } from '../../components';
import * as EventType from '../../events';

const MONEY_PER_ENEMY = 10;

export class PlayerScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.scene.addEventListener(EventType.EnemyDeath, this.handleEnemyDeath);
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.EnemyDeath, this.handleEnemyDeath);
  }

  private handleEnemyDeath = (): void => {
    const money = this.actor.getComponent(Money);
    money.value += MONEY_PER_ENEMY;
    this.scene.dispatchEvent(EventType.MoneyUpdate, { money: money.value });
  };
}

PlayerScript.scriptName = 'PlayerScript';
