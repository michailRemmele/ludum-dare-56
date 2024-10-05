import type { Actor, ScriptOptions } from 'remiz';
import {
  Script,
  Transform,
} from 'remiz';
import {
  CollisionEnter,
  CollisionLeave,
} from 'remiz/events';
import type {
  CollisionEnterEvent,
  CollisionLeaveEvent,
} from 'remiz/events';

import { Movement } from '../../components';
import * as EventType from '../../events';

export class TowerScript extends Script {
  private actor: Actor;
  private enemies: Actor[];

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.enemies = [];

    this.actor.addEventListener(CollisionEnter, this.handleMarkEnemy);
    this.actor.addEventListener(CollisionLeave, this.handleUnmarkEnemy);
  }

  destroy(): void {
    this.actor.removeEventListener(CollisionEnter, this.handleMarkEnemy);
    this.actor.removeEventListener(CollisionLeave, this.handleUnmarkEnemy);
  }

  private handleMarkEnemy = (event: CollisionEnterEvent): void => {
    if (!event.actor.getComponent(Movement)) {
      return;
    }
    this.enemies.push(event.actor);
  };

  private handleUnmarkEnemy = (event: CollisionLeaveEvent): void => {
    this.enemies = this.enemies.filter((actor) => actor.id !== event.actor.id);
  };

  update(): void {
    if (this.enemies.length) {
      const currentTarget = this.enemies[0];
      const transform = currentTarget.getComponent(Transform);

      this.actor.dispatchEvent(EventType.AttackInput, {
        x: transform.offsetX,
        y: transform.offsetY,
      });
    }
  }
}

TowerScript.scriptName = 'TowerScript';
