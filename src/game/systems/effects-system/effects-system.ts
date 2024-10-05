import { ActorCollection, System } from 'remiz';
import type {
  SystemOptions,
  Scene,
  ActorSpawner,
  UpdateOptions,
  Actor,
} from 'remiz';
import { RemoveActor } from 'remiz/events';
import type { RemoveActorEvent } from 'remiz/events';

import * as EventType from '../../events';
import type { AddEffectEvent, RemoveEffectEvent } from '../../events';
import { ActiveEffects, Effect } from '../../components';
import { Constructor } from '../../../types/utils';

import type { EffectScript } from './effect-script';
import { effectApplicators } from './effect-applicators';
import type { EffectApplicator } from './effect-applicators/effect-applicator';

export class EffectsSystem extends System {
  private scene: Scene;
  private activeEffectsCollection: ActorCollection;
  private effectsCollection: ActorCollection;
  private actorSpawner: ActorSpawner;
  private scripts: Record<string, Constructor<EffectScript>>;
  private applicatorsMap: Record<string, Record<string, EffectApplicator>>;

  constructor(options: SystemOptions) {
    super();

    const {
      actorSpawner,
      resources = {},
      scene,
    } = options;

    this.scene = scene;
    this.activeEffectsCollection = new ActorCollection(scene, {
      components: [ActiveEffects],
    });
    this.effectsCollection = new ActorCollection(scene, {
      components: [Effect],
    });
    this.actorSpawner = actorSpawner;
    this.scripts = resources as Record<string, { new(): EffectScript }>;

    this.applicatorsMap = {};
  }

  mount(): void {
    this.scene.addEventListener(EventType.AddEffect, this.handleAddEffect);
    this.scene.addEventListener(EventType.RemoveEffect, this.handleRemoveEffect);

    this.activeEffectsCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.AddEffect, this.handleAddEffect);
    this.scene.removeEventListener(EventType.RemoveEffect, this.handleRemoveEffect);

    this.activeEffectsCollection.removeEventListener(RemoveActor, this.handleActorRemove);
  }

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;

    Object.keys(this.applicatorsMap[actor.id])?.forEach((name) => {
      delete this.applicatorsMap[actor.id][name];
    });
  };

  private handleAddEffect = (event: AddEffectEvent): void => {
    const { id, options, target } = event;
    this.cancelEffect(id, target);
    this.addEffect(id, target, options);
  };

  private handleRemoveEffect = (event: RemoveEffectEvent): void => {
    const { id, target } = event;
    this.cancelEffect(id, target);
  };

  private cancelEffect(id: string, actor: Actor): void {
    if (!this.applicatorsMap[actor.id] || !this.applicatorsMap[actor.id][id]) {
      return;
    }

    this.applicatorsMap[actor.id][id].cancel();
    delete this.applicatorsMap[actor.id][id];

    const activeEffects = actor.getComponent(ActiveEffects);
    const effectActor = activeEffects.map[id];

    delete activeEffects.map[id];
    activeEffects.list = activeEffects.list.filter((activeEffectId) => id !== activeEffectId);

    const effect = effectActor.getComponent(Effect);
    effect.isCancelled = true;
  }

  private addEffect(id: string, actor: Actor, options: Record<string, unknown>): void {
    const effectActor = this.actorSpawner.spawn(id);
    actor.appendChild(effectActor);

    const {
      script,
      type,
      options: constOptions,
    } = effectActor.getComponent(Effect);

    if (!actor.getComponent(ActiveEffects)) {
      actor.setComponent(new ActiveEffects());
    }

    const activeEffects = actor.getComponent(ActiveEffects);
    activeEffects.list.push(id);
    activeEffects.map[id] = effectActor;

    const EffectScript = this.scripts[script];
    const EffectApplicator = effectApplicators[type];

    const effectApplicator = new EffectApplicator(
      new EffectScript(actor, { ...constOptions, ...options }),
      effectActor,
    );

    this.applicatorsMap[actor.id] ??= {};
    this.applicatorsMap[actor.id][id] = effectApplicator;
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.effectsCollection.forEach((actor) => {
      const effect = actor.getComponent(Effect);
      if (!effect.isCancelled) {
        return;
      }

      effect.removeTimeout -= deltaTime;
      if (effect.removeTimeout <= 0) {
        actor.remove();
      }
    });

    this.activeEffectsCollection.forEach((actor) => {
      const activeEffects = actor.getComponent(ActiveEffects);

      activeEffects.list = activeEffects.list.filter((id) => {
        const effectApplicator = this.applicatorsMap[actor.id][id];
        const effectActor = activeEffects.map[id];
        const effect = effectActor.getComponent(Effect);

        effectApplicator.update(deltaTime);

        if (effectApplicator.isFinished) {
          effectApplicator.cancel();

          delete this.applicatorsMap[actor.id][id];
          delete activeEffects.map[id];

          effect.isCancelled = true;

          return false;
        }

        return true;
      });
    });
  }
}

EffectsSystem.systemName = 'EffectsSystem';
