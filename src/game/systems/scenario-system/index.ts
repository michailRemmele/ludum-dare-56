import {
  System,
} from 'remiz';
import type {
  Scene,
  SystemOptions,
  UpdateOptions,
} from 'remiz';

import { ENEMY_SPAWNER_ID } from '../../../consts/templates';
import * as EventType from '../../events';

import { waves } from './waves';

const INITIAL_TIMEOUT = 10_000;
const PACK_TIMEOUT = 500;
const WAVE_TIMEOUT = 10_000;

export class ScenarioSystem extends System {
  private scene: Scene;

  private currentWave: number;
  private currentPack: number;
  private timeout: number;

  private isSpawnEnd: boolean;
  private enemiesLeft: number;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;

    this.currentWave = -1;
    this.currentPack = 0;
    this.timeout = INITIAL_TIMEOUT;

    this.isSpawnEnd = false;

    const spawnerCount = this.scene.children.reduce((acc, actor) => {
      if (actor.templateId === ENEMY_SPAWNER_ID) {
        return acc + 1;
      }
      return acc;
    }, 0);

    this.enemiesLeft = spawnerCount * waves.reduce((count, stage) => {
      return count + stage.reduce(
        (waveCount, wave) => waveCount + Object.values(wave).reduce(
          (creatureCount, value) => creatureCount + value,
          0,
        ),
        0,
      );
    }, 0);

    this.scene.data.totalWaves = waves.length;
  }

  mount(): void {
    this.scene.addEventListener(EventType.EnemyDeath, this.handleDeathEnemy);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.EnemyDeath, this.handleDeathEnemy);
  }

  private handleDeathEnemy = (): void => {
    this.enemiesLeft -= 1;

    if (this.enemiesLeft === 0) {
      this.scene.dispatchEvent(EventType.GameOver, { isWin: true });
    }
  };

  update(options: UpdateOptions): void {
    if (this.isSpawnEnd) {
      return;
    }

    const { deltaTime } = options;

    this.timeout = Math.max(0, this.timeout - deltaTime);
    if (this.timeout > 0) {
      return;
    }
    if (this.currentWave === -1 || this.currentPack === waves[this.currentWave].length) {
      this.currentWave += 1;
      this.currentPack = 0;
      this.scene.dispatchEvent(EventType.NextWave);
    }

    const pack = waves[this.currentWave][this.currentPack];

    for (const templateId in pack) {
      this.scene.dispatchEvent(EventType.SpawnCreature, {
        templateId,
        quantity: pack[templateId],
      });
    }

    this.currentPack += 1;
    this.timeout = PACK_TIMEOUT;

    if (this.currentPack === waves[this.currentWave].length) {
      this.timeout = WAVE_TIMEOUT;

      if (this.currentWave === waves.length - 1) {
        this.isSpawnEnd = true;
      }
    }
  }
}

ScenarioSystem.systemName = 'ScenarioSystem';
