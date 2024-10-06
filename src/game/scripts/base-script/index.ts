import type { Actor, ScriptOptions, Scene } from 'remiz';
import {
  Script,
} from 'remiz';
import {
  CollisionEnter,
} from 'remiz/events';
import type {
  CollisionEnterEvent,
} from 'remiz/events';

import { Movement } from '../../components';
import * as EventType from '../../events';

const DAMAGE_PER_ENEMY = 10;

export class BaseScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.scene = options.scene;
    this.actor = options.actor;

    this.actor.addEventListener(CollisionEnter, this.handleEnemyCollision);
    this.actor.addEventListener(EventType.Kill, this.handleKill);
  }

  destroy(): void {
    this.actor.removeEventListener(CollisionEnter, this.handleEnemyCollision);
  }

  private handleEnemyCollision = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    if (!actor.getComponent(Movement)) {
      return;
    }

    actor.dispatchEvent(EventType.Kill, { force: true });
    this.actor.dispatchEvent(EventType.Damage, { value: DAMAGE_PER_ENEMY });
  };

  private handleKill = (): void => {
    this.scene.dispatchEvent(EventType.GameOver, { isWin: false });
  };
}

BaseScript.scriptName = 'BaseScript';
