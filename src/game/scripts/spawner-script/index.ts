import type {
  Scene,
  ActorSpawner,
  ScriptOptions,
} from 'remiz';
import {
  Script,
  Transform,
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

  private x: number;
  private y: number;

  constructor(options: SpawnerScriptOptions) {
    super();

    const {
      actor,
      scene,
      actorSpawner,
    } = options;

    this.scene = scene;
    this.actorSpawner = actorSpawner;

    const transform = actor.getComponent(Transform);

    this.x = transform.offsetX;
    this.y = transform.offsetY;

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

      transform.offsetX = this.x;
      transform.offsetY = this.y;

      this.scene.appendChild(enemy);
    }
  };
}

SpawnerScript.scriptName = 'SpawnerScript';
