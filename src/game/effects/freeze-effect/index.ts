import { Sprite } from 'remiz';
import type { Actor } from 'remiz';

import { Movement } from '../../components';
import type { EffectScript } from '../../systems/effects-system';

interface EffectOptions {
  slowFactor: number
}

export class FreezeEffect implements EffectScript {
  private actor: Actor;
  private slowFactor: number;
  private prevColor?: string;

  constructor(actor: Actor, options: EffectOptions) {
    this.actor = actor;
    this.slowFactor = options.slowFactor;
  }

  apply(): void {
    const movement = this.actor.getComponent(Movement);

    if (!movement) {
      return;
    }

    if (movement.speed !== movement.maxSpeed) {
      return;
    }

    movement.speed = movement.maxSpeed * this.slowFactor;

    const model = this.actor.children.find((child) => child.name === 'Model');
    const sprite = model?.getComponent(Sprite);
    if (!sprite) {
      return;
    }

    this.prevColor = sprite.material.options.color;
    sprite.material.options.color = '#5380FF';
  }

  onCancel(): void {
    const movement = this.actor.getComponent(Movement);

    if (!movement) {
      return;
    }

    movement.speed = movement.maxSpeed;

    const sprite = this.actor.getComponent(Sprite);
    if (!sprite) {
      return;
    }

    sprite.material.options.color = this.prevColor;
  }
}
