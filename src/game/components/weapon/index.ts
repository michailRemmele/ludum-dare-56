import { Component } from 'remiz';

import { MeleeWeapon } from './melee-weapon';
import { RangeWeapon } from './range-weapon';
import { AOEWeapon } from './aoe-weapon';
import { FreezeWeapon } from './freeze-weapon';

const weapons = {
  melee: MeleeWeapon,
  range: RangeWeapon,
  aoe: AOEWeapon,
  freeze: FreezeWeapon,
};

export interface WeaponConfig {
  type: 'melee' | 'range' | 'aoe' | 'freeze'
  cooldown: number
  properties: Record<string, unknown>
}

export class Weapon extends Component {
  type: 'melee' | 'range' | 'aoe' | 'freeze';
  cooldown: number;
  cooldownRemaining: number;
  isActive: boolean;
  properties: MeleeWeapon | RangeWeapon | AOEWeapon;

  constructor(config: WeaponConfig) {
    super();

    this.type = config.type;
    this.cooldown = config.cooldown;
    this.cooldownRemaining = 0;
    this.isActive = false;

    if (!weapons[this.type]) {
      throw new Error(`Not found weapon with same type: ${this.type}`);
    }

    this.properties = new weapons[this.type](config.properties);
  }

  clone(): Weapon {
    return new Weapon({
      type: this.type,
      cooldown: this.cooldown,
      properties: this.properties.clone() as unknown as Record<string, unknown>,
    });
  }
}

Weapon.componentName = 'Weapon';
