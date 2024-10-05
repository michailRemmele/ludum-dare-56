import type { Actor } from 'remiz';

import type { EffectScript } from '../effect-script';
import * as EventType from '../../../events';

export abstract class EffectApplicator {
  protected script: EffectScript;
  protected actor: Actor;

  abstract isFinished: boolean;

  constructor(script: EffectScript, actor: Actor) {
    this.script = script;
    this.actor = actor;
  }

  protected handleCancel(): void {
    this.actor.dispatchEvent(EventType.CancelEffect);
  }

  protected handleApply(): void {
    this.actor.dispatchEvent(EventType.ApplyEffect);
  }

  abstract update(deltaTime: number): void;

  abstract cancel(): void;
}
