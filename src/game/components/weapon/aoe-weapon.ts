export interface AOEWeaponConfig extends Record<string, unknown> {
  damage: number
  range: number
  projectileSpeed: number
  projectileModel: string
  projectileRadius: number
  explosionModel: string
  explosionRadius: number
}

export class AOEWeapon {
  damage: number;
  range: number;
  projectileSpeed: number;
  projectileModel: string;
  projectileRadius: number;
  explosionModel: string;
  explosionRadius: number;

  constructor(config: Record<string, unknown>) {
    const {
      damage,
      range,
      projectileSpeed,
      projectileModel,
      projectileRadius,
      explosionModel,
      explosionRadius,
    } = config as AOEWeaponConfig;

    this.damage = damage;
    this.range = range;
    this.projectileSpeed = projectileSpeed;
    this.projectileModel = projectileModel;
    this.projectileRadius = projectileRadius;
    this.explosionModel = explosionModel;
    this.explosionRadius = explosionRadius;
  }

  clone(): AOEWeapon {
    return new AOEWeapon({
      damage: this.damage,
      range: this.range,
      projectileSpeed: this.projectileSpeed,
      projectileModel: this.projectileModel,
      projectileRadius: this.projectileRadius,
      explosionModel: this.explosionModel,
      explosionRadius: this.explosionRadius,
    });
  }
}
