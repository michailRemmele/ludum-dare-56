import { MeleeAttack } from './melee-attack';
import { RangeAttack } from './range-attack';
import { AOEAttack } from './aoe-attack';

export type { Attack } from './attack';

export const attacks = {
  melee: MeleeAttack,
  range: RangeAttack,
  aoe: AOEAttack,
};
