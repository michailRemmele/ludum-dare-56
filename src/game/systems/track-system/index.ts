import { MathOps, System, Transform, UpdateOptions } from "remiz";
import { ActorCollection, Scene, SystemOptions } from "remiz";
import { RemoveActor, RemoveActorEvent } from "remiz/events";

import { TrackSegment, Movement } from "../../components";
import * as EventType from "../../events";

export class TrackSystem extends System {
  private scene: Scene;
  private segmentsCollection: ActorCollection;
  private movementCollection: ActorCollection;
  private angles: Record<string, number>;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;

    this.segmentsCollection = new ActorCollection(options.scene, {
      components: [TrackSegment],
    });

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
    // TODO: sort by index
    const segmentsOffsets: Pick<Transform, "offsetX" | "offsetY">[] = [];

    this.segmentsCollection.forEach((actor) => {
      const { offsetX, offsetY } = actor.getComponent(Transform);

      segmentsOffsets.push({ offsetX, offsetY });
    });

    this.movementCollection.forEach((actor) => {
      const transform = actor.getComponent(Transform);
      const intersectedSegmentIndex = segmentsOffsets.findIndex(
        (segment) =>
          segment.offsetX === transform.offsetX &&
          segment.offsetY === transform.offsetY
      );
      const intersectedSegment = segmentsOffsets[intersectedSegmentIndex];

      if (intersectedSegment) {
        const nextSegment = segmentsOffsets[intersectedSegmentIndex + 1];

        if (!nextSegment) {
          return;
        }

        const angle =
          MathOps.radToDeg(
            MathOps.getAngleBetweenTwoPoints(
              intersectedSegment.offsetX,
              nextSegment.offsetX,
              intersectedSegment.offsetY,
              nextSegment.offsetY
            )
          ) - 180;
        this.angles[actor.id] = angle;

        actor.dispatchEvent(EventType.Movement, { angle });
      } else {
        actor.dispatchEvent(EventType.Movement, {
          angle: this.angles[actor.id],
        });
      }
    });
  }
}

TrackSystem.systemName = "TrackSystem";
