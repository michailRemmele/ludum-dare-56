import {
  System,
} from 'remiz';
import type {
  Scene,
  SystemOptions,
  UpdateOptions,
} from 'remiz';

import { Level } from '../../components';
import { ENEMY_SPAWNER_ID } from '../../../consts/templates';
import * as EventType from '../../events';

import { levels } from './waves';
import { Wave } from './types';

const INITIAL_TIMEOUT = 5_000;
const PACK_TIMEOUT = 500;
const WAVE_TIMEOUT = 10_000;

const PLAYER_ACTOR_NAME = 'Player';

export class ScenarioSystem extends System {
  private scene: Scene;

  private currentWave: number;
  private currentPack: number;
  private timeout: number;

  private level: Array<Wave>;
  private spawnerCount: number;
  private isSpawnEnd: boolean;
  private waveEnemiesLeft: number;
  private enemiesLeft: number;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;

    this.currentWave = -1;
    this.currentPack = 0;
    this.timeout = INITIAL_TIMEOUT;

    this.isSpawnEnd = false;

    const player = this.scene.getEntityByName(PLAYER_ACTOR_NAME);

    if (!player) {
      throw new Error('Player actor not fount');
    }

    const levelComponent = player.getComponent(Level);
    this.level = levels[levelComponent.index];

    this.spawnerCount = this.scene.children.reduce((acc, actor) => {
      if (actor.templateId === ENEMY_SPAWNER_ID) {
        return acc + 1;
      }
      return acc;
    }, 0);

    this.enemiesLeft = this.level.reduce((count, wave) => {
      return count + this.countWaveEnemies(wave);
    }, 0);
    this.waveEnemiesLeft = 0;

    this.scene.data.totalWaves = this.level.length;
  }

  mount(): void {
    this.scene.addEventListener(EventType.EnemyDeath, this.handleDeathEnemy);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.EnemyDeath, this.handleDeathEnemy);
  }

  private handleDeathEnemy = (): void => {
    this.enemiesLeft -= 1;
    this.waveEnemiesLeft -= 1;

    if (this.waveEnemiesLeft === 0) {
      this.timeout = WAVE_TIMEOUT;
    }

    if (this.enemiesLeft === 0) {
      this.isSpawnEnd = true;
      this.scene.dispatchEvent(EventType.GameOver, { isWin: true });
    }
  };

  private isWaveSpawnCompleted(): boolean {
    return this.currentPack === this.level[this.currentWave].length;
  }

  private isWaveCompleted(): boolean {
    return this.isWaveSpawnCompleted() && this.waveEnemiesLeft === 0;
  }

  private countWaveEnemies(wave: Wave): number {
    return this.spawnerCount * wave.length;
  }

  update(options: UpdateOptions): void {
    if (this.isSpawnEnd) {
      return;
    }

    const { deltaTime } = options;

    this.timeout = Math.max(0, this.timeout - deltaTime);
    if (this.timeout > 0) {
      return;
    }
    if (this.currentWave === -1 || this.isWaveCompleted()) {
      this.currentWave += 1;
      this.currentPack = 0;
      this.waveEnemiesLeft = this.countWaveEnemies(this.level[this.currentWave]);
      this.scene.dispatchEvent(EventType.NextWave);
    }

    if (!this.isWaveSpawnCompleted()) {
      const pack = this.level[this.currentWave][this.currentPack];
      this.scene.dispatchEvent(EventType.SpawnCreature, {
        templateId: pack,
        quantity: 1,
      });

      this.currentPack += 1;
      this.timeout = PACK_TIMEOUT;
    }
  }
}

ScenarioSystem.systemName = 'ScenarioSystem';
