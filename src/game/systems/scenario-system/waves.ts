import { ENEMY_ID, ENEMY_2_ID, ENEMY_3_ID } from '../../../consts/templates';

import type { Wave } from './types';

export const level: Array<Wave> = [
  [
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_ID,
  ],
  [
    ENEMY_2_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_2_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_2_ID,
    ENEMY_ID,
    ENEMY_ID,
    ENEMY_2_ID,
  ],
  [
    ENEMY_3_ID,
    ENEMY_2_ID,
    ENEMY_ID,
    ENEMY_3_ID,
    ENEMY_2_ID,
    ENEMY_ID,
    ENEMY_3_ID,
    ENEMY_2_ID,
    ENEMY_ID,
    ENEMY_3_ID,
  ],
];

export const levels = [
  level,
  level,
  level,
];
