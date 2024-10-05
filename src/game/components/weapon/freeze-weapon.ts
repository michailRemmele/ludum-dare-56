export interface FreezeWeaponConfig extends Record<string, unknown> {
  damage: number
  range: number
  projectileSpeed: number
  projectileModel: string
  projectileRadius: number
  explosionModel: string
  explosionRadius: number
  slowFactor: number;
}

export class FreezeWeapon {
  damage: number;
  range: number;
  projectileSpeed: number;
  projectileModel: string;
  projectileRadius: number;
  explosionModel: string;
  explosionRadius: number;
  slowFactor: number;

  constructor(config: Record<string, unknown>) {
    const {
      damage,
      range,
      projectileSpeed,
      projectileModel,
      projectileRadius,
      explosionModel,
      explosionRadius,
      slowFactor,
    } = config as FreezeWeaponConfig;

    this.damage = damage;
    this.range = range;
    this.projectileSpeed = projectileSpeed;
    this.projectileModel = projectileModel;
    this.projectileRadius = projectileRadius;
    this.explosionModel = explosionModel;
    this.explosionRadius = explosionRadius;
    this.slowFactor = slowFactor;
  }

  clone(): FreezeWeapon {
    return new FreezeWeapon({
      damage: this.damage,
      range: this.range,
      projectileSpeed: this.projectileSpeed,
      projectileModel: this.projectileModel,
      projectileRadius: this.projectileRadius,
      explosionModel: this.explosionModel,
      explosionRadius: this.explosionRadius,
      slowFactor: this.slowFactor,
    });
  }
}
