import {
  Actor, MathOps, System, Transform,
  ActorCollection, SystemOptions,
} from 'remiz';
import { RemoveActor, RemoveActorEvent } from 'remiz/events';

import { TrackSegment, Movement } from '../../components';
import * as EventType from '../../events';

export class TrackSystem extends System {
  private segmentsCollection: ActorCollection;
  private movementCollection: ActorCollection;

  private angles: Record<Actor['id'], number>;
  private passes: Record<Actor['id'], Set<Actor['id']>>;

  constructor(options: SystemOptions) {
    super();

    this.segmentsCollection = new ActorCollection(options.scene, {
      components: [TrackSegment],
    });

    this.segmentsCollection.sort((a: Actor, b: Actor) => a.name.localeCompare(b.name));

    this.movementCollection = new ActorCollection(options.scene, {
      components: [Movement],
    });

    this.angles = {};
    this.passes = {};
  }

  private handleRemoveActor = (event: RemoveActorEvent): void => {
    delete this.angles[event.actor.id];
  };

  mount(): void {
    this.movementCollection.addEventListener(
      RemoveActor,
      this.handleRemoveActor,
    );
  }

  fixedUpdate(): void {
    const segments: (Pick<Transform, 'offsetX' | 'offsetY'> &
    Pick<TrackSegment, 'next'> &
    Pick<Actor, 'id'>)[] = [];

    this.segmentsCollection.forEach((actor) => {
      const { next } = actor.getComponent(TrackSegment);
      const { offsetX, offsetY } = actor.getComponent(Transform);

      segments.push({
        offsetX, offsetY, next, id: actor.id,
      });
    });

    this.movementCollection.forEach((actor) => {
      const transform = actor.getComponent(Transform);

      const intersectedSegment = segments.find(
        (segment) => Math.abs(segment.offsetX - transform.offsetX) < 1
          && Math.abs(segment.offsetY - transform.offsetY) < 1,
      );

      if (intersectedSegment) {
        this.passes[intersectedSegment.id] ??= new Set();
        const nextSegmentIndex = this.passes[intersectedSegment.id].size
          % intersectedSegment.next.length;

        const nextSegment = this.segmentsCollection.getById(
          intersectedSegment.next[nextSegmentIndex],
        );

        if (!nextSegment) {
          return;
        }

        const { offsetX, offsetY } = nextSegment.getComponent(Transform);

        const angle = MathOps.radToDeg(
          MathOps.getAngleBetweenTwoPoints(
            intersectedSegment.offsetX,
            offsetX,
            intersectedSegment.offsetY,
            offsetY,
          ),
        ) - 180;
        this.angles[actor.id] = angle;

        actor.dispatchEvent(EventType.Movement, { angle });

        this.passes[intersectedSegment.id].add(actor.id);

        return;
      }

      actor.dispatchEvent(EventType.Movement, {
        angle: this.angles[actor.id],
      });
    });
  }
}

TrackSystem.systemName = 'TrackSystem';
