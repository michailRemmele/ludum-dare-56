import type { Actor } from 'remiz';

import type { EffectScript } from '../effect-script';
import { Effect } from '../../../components';
import type { PeriodicalEffectOptions } from '../../../components';

import { EffectApplicator } from './effect-applicator';

export class PeriodicalEffectApplicator extends EffectApplicator {
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
    ).applicatorOptions as PeriodicalEffectOptions;

    applicatorOptions.cooldown -= deltaTime;

    while (applicatorOptions.cooldown <= 0) {
      this.script.apply();
      this.handleApply();
      applicatorOptions.cooldown += applicatorOptions.frequency;
    }

    if (applicatorOptions.duration) {
      applicatorOptions.duration -= deltaTime;
      if (applicatorOptions.duration <= 0) {
        this.isFinished = true;
      }
    }
  }

  cancel(): void {
    this.handleCancel();
  }
}
