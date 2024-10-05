import type { Actor } from 'remiz';

import type { EffectScript } from '../effect-script';

import { EffectApplicator } from './effect-applicator';

export class ContinuousEffectApplicator extends EffectApplicator {
  isFinished: boolean;
  isApplied: boolean;

  constructor(script: EffectScript, actor: Actor) {
    super(script, actor);

    this.isApplied = false;
    this.isFinished = false;
  }

  update(): void {
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
