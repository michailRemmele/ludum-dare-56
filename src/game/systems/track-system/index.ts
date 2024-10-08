import {
  Actor, MathOps, System, Transform,
  ActorCollection, SystemOptions,
} from 'remiz';
import { RemoveActor, RemoveActorEvent } from 'remiz/events';

import { TrackSegment, Movement } from '../../components';
import * as EventType from '../../events';

const DESTINATION_THRESOLD = 4;

export class TrackSystem extends System {
  private segmentsCollection: ActorCollection;
  private movementCollection: ActorCollection;

  private destinations: Record<Actor['id'], [number, number]>;
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

    this.destinations = {};
    this.passes = {};
  }

  private handleRemoveActor = (event: RemoveActorEvent): void => {
    delete this.destinations[event.actor.id];
  };

  mount(): void {
    this.movementCollection.addEventListener(
      RemoveActor,
      this.handleRemoveActor,
    );
  }

  private getMovementAngle(actor: Actor): number | undefined {
    if (!this.destinations[actor.id]) {
      return undefined;
    }

    const { offsetX, offsetY } = actor.getComponent(Transform);
    const [destX, destY] = this.destinations[actor.id];

    return MathOps.radToDeg(
      MathOps.getAngleBetweenTwoPoints(
        offsetX,
        destX,
        offsetY,
        destY,
      ),
    ) - 180;
  }

  update(): void {
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
        (segment) => {
          const distance = MathOps.getDistanceBetweenTwoPoints(
            transform.offsetX,
            segment.offsetX,
            transform.offsetY,
            segment.offsetY,
          );

          return distance < DESTINATION_THRESOLD;
        },
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

        this.destinations[actor.id] = [offsetX, offsetY];
        const angle = this.getMovementAngle(actor);
        if (angle !== undefined) {
          actor.dispatchEvent(EventType.Movement, { angle });
        }

        this.passes[intersectedSegment.id].add(actor.id);

        return;
      }

      const angle = this.getMovementAngle(actor);
      if (angle !== undefined) {
        actor.dispatchEvent(EventType.Movement, { angle });
      }
    });
  }
}

TrackSystem.systemName = 'TrackSystem';
