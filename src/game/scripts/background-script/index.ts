import type { Actor, ScriptOptions } from 'remiz';
import {
  Script,
} from 'remiz';
import {
  CollisionLeave,
} from 'remiz/events';
import type {
  CollisionEnterEvent,
} from 'remiz/events';

import { Movement } from '../../components';
import * as EventType from '../../events';

export class BackgroundScript extends Script {
  private actor: Actor;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;

    this.actor.addEventListener(CollisionLeave, this.handleEnemyCollision);
  }

  destroy(): void {
    this.actor.removeEventListener(CollisionLeave, this.handleEnemyCollision);
  }

  private handleEnemyCollision = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    if (!actor.getComponent(Movement)) {
      return;
    }

    actor.dispatchEvent(EventType.Kill, { force: true });
  };
}

BackgroundScript.scriptName = 'BackgroundScript';
