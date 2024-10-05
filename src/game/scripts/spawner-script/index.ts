import type {
  Scene,
  ActorSpawner,
  ScriptOptions,
} from 'remiz';
import {
  Script,
  Transform,
  MathOps,
} from 'remiz';

import * as EventType from '../../events';
import type { SpawnCreatureEvent } from '../../events';

interface SpawnerScriptOptions extends ScriptOptions {
  sizeX: number
  sizeY: number
}

export class SpawnerScript extends Script {
  private scene: Scene;
  private actorSpawner: ActorSpawner;

  private x0: number;
  private x1: number;
  private y0: number;
  private y1: number;

  constructor(options: SpawnerScriptOptions) {
    super();

    const {
      actor,
      scene,
      actorSpawner,
      sizeX,
      sizeY,
    } = options;

    this.scene = scene;
    this.actorSpawner = actorSpawner;

    const transform = actor.getComponent(Transform);

    this.x0 = transform.offsetX - sizeX / 2;
    this.x1 = transform.offsetX + sizeX / 2;
    this.y0 = transform.offsetY - sizeY / 2;
    this.y1 = transform.offsetY + sizeY / 2;

    this.scene.addEventListener(EventType.SpawnCreature, this.handleSpawnCreature);
  }

  destroy(): void {
    this.scene.removeEventListener(EventType.SpawnCreature, this.handleSpawnCreature);
  }

  private handleSpawnCreature = (event: SpawnCreatureEvent): void => {
    const { templateId, quantity } = event;

    for (let i = 0; i < quantity; i += 1) {
      const enemy = this.actorSpawner.spawn(templateId);
      const transform = enemy.getComponent(Transform);

      transform.offsetX = MathOps.random(this.x0, this.x1);
      transform.offsetY = MathOps.random(this.y0, this.y1);

      this.scene.appendChild(enemy);
    }
  };
}

SpawnerScript.scriptName = 'SpawnerScript';
