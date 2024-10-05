import { Actor, MathOps, System, Transform, UpdateOptions } from "remiz";
import { ActorCollection, Scene, SystemOptions } from "remiz";
import { RemoveActor, RemoveActorEvent } from "remiz/events";

import { TrackSegment, Movement } from "../../components";
import * as EventType from "../../events";

export class TrackSystem extends System {
  private scene: Scene;
  private segmentsCollection: ActorCollection;
  private movementCollection: ActorCollection;
  private angles: Record<string, number>;
  private nextSegment: string = "";

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;

    this.segmentsCollection = new ActorCollection(options.scene, {
      components: [TrackSegment],
    });

    this.segmentsCollection.sort((a: Actor, b: Actor) =>
      a.name.localeCompare(b.name)
    );

    this.movementCollection = new ActorCollection(options.scene, {
      components: [Movement],
    });

    this.angles = {};
  }

  private handleRemoveActor = (event: RemoveActorEvent): void => {
    delete this.angles[event.actor.id];
  };

  mount(): void {
    this.movementCollection.addEventListener(
      RemoveActor,
      this.handleRemoveActor
    );
  }

  update(options: UpdateOptions): void {
    const segments: (Pick<Transform, "offsetX" | "offsetY"> & Pick<TrackSegment, "next">)[] = [];

    this.segmentsCollection.forEach((actor) => {
      const { next } = actor.getComponent(TrackSegment);
      const { offsetX, offsetY } = actor.getComponent(Transform);

      segments.push({ offsetX, offsetY, next });
    });

    this.movementCollection.forEach((actor, i) => {
      const transform = actor.getComponent(Transform);

      // Ищем пересечения центов
      const intersectedSegment = segments.find(
        (segment) =>
          Math.abs(segment.offsetX - transform.offsetX) < 1 &&
          Math.abs(segment.offsetY - transform.offsetY) < 1
      );

      if (intersectedSegment) {
        const nextSegment = this.segmentsCollection.getById(
          intersectedSegment.next[i % intersectedSegment.next.length]
        );

        if (!nextSegment) {
          return;
        }

        const { offsetX, offsetY } = nextSegment.getComponent(Transform);

        const angle =
          MathOps.radToDeg(
            MathOps.getAngleBetweenTwoPoints(
              intersectedSegment.offsetX,
              offsetX,
              intersectedSegment.offsetY,
              offsetY
            )
          ) - 180;
        this.angles[actor.id] = angle;

        actor.dispatchEvent(EventType.Movement, { angle });
        return;
      }

      actor.dispatchEvent(EventType.Movement, {
        angle: this.angles[actor.id],
      });
    });
  }
}

TrackSystem.systemName = "TrackSystem";
