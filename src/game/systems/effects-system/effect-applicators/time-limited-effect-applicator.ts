import type { Actor } from 'remiz';

import type { EffectScript } from '../effect-script';
import { Effect } from '../../../components';
import type { TimeLimitedEffectOptions } from '../../../components';

import { EffectApplicator } from './effect-applicator';

export class TimeLimitedEffectApplicator extends EffectApplicator {
  isFinished: boolean;
  isApplied: boolean;

  constructor(script: EffectScript, actor: Actor) {
    super(script, actor);

    this.isApplied = false;
    this.isFinished = false;
  }

  update(deltaTime: number): void {
    if (this.isFinished) {
      return;
    }

    const applicatorOptions = this.actor.getComponent(
      Effect,
    ).applicatorOptions as TimeLimitedEffectOptions;

    applicatorOptions.duration -= deltaTime;

    if (applicatorOptions.duration <= 0) {
      this.isFinished = true;
      return;
    }

    if (this.isApplied) {
      return;
    }

    this.script.apply();
    this.handleApply();
    this.isApplied = true;
  }

  cancel(): void {
    if (!this.isApplied) {
      return;
    }

    this.script.onCancel();
    this.handleCancel();
  }
}
