import type { Actor } from 'remiz';

import type { EffectScript } from '../effect-script';
import { Effect } from '../../../components';
import type { DelayedEffectOptions } from '../../../components';

import { EffectApplicator } from './effect-applicator';

export class DelayedEffectApplicator extends EffectApplicator {
  isFinished: boolean;

  constructor(script: EffectScript, actor: Actor) {
    super(script, actor);

    this.isFinished = false;
  }

  update(deltaTime: number): void {
    if (this.isFinished) {
      return;
    }

    const applicatorOptions = this.actor.getComponent(
      Effect,
    ).applicatorOptions as DelayedEffectOptions;

    applicatorOptions.timer -= deltaTime;

    if (applicatorOptions.timer <= 0) {
      this.script.apply();
      this.handleApply();
      this.isFinished = true;
    }
  }

  cancel(): void {
    this.handleCancel();
  }
}
