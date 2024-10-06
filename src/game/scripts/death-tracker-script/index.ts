import type {
  Actor,
  ScriptOptions,
  Scene,
} from 'remiz';
import { Script } from 'remiz';

import * as EventType from '../../events';
import type { KillEvent } from '../../events';

export class DeathTrackerScript extends Script {
  private actor: Actor;
  private scene: Scene;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.scene = options.scene;

    this.actor.addEventListener(EventType.Kill, this.handleKill);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.Kill, this.handleKill);
  }

  private handleKill = (event: KillEvent): void => {
    this.scene.dispatchEvent(EventType.EnemyDeath, { withoutReward: event.force });
  };
}

DeathTrackerScript.scriptName = 'DeathTrackerScript';
