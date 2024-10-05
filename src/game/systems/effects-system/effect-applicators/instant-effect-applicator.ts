import type { Actor } from 'remiz';

import type { EffectScript } from '../effect-script';

import { EffectApplicator } from './effect-applicator';

export class InstantEffectApplicator extends EffectApplicator {
  isFinished: boolean;

  constructor(script: EffectScript, actor: Actor) {
    super(script, actor);

    this.isFinished = false;
  }

  update(): void {
    if (this.isFinished) {
      return;
    }

    this.script.apply();
    this.handleApply();
    this.isFinished = true;
  }

  cancel(): void {
    this.handleCancel();
  }
}
