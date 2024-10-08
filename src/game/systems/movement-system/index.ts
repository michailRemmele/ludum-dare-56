import {
  Scene,
  ActorCollection,
  MathOps,
  VectorOps,
  System,
  Transform,
} from 'remiz';
import type { SystemOptions, UpdateOptions } from 'remiz';

import * as EventType from '../../events';
import type { MoveEvent } from '../../events';
import { Movement, ViewDirection } from '../../components';

export class MovementSystem extends System {
  private scene: Scene;
  private actorCollection: ActorCollection;

  constructor(options: SystemOptions) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        Movement,
        Transform,
      ],
    });
  }

  mount(): void {
    this.scene.addEventListener(EventType.Movement, this.handleMovement);
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.Movement, this.handleMovement);
  }

  private handleMovement = (event: MoveEvent): void => {
    const { target, angle } = event;

    const movement = target.getComponent(Movement) as Movement | undefined;
    if (!movement) {
      return;
    }

    if (!movement.isMoving) {
      movement.direction.multiplyNumber(0);
      movement.isMoving = true;
    }

    movement.direction.add(VectorOps.getVectorByAngle(MathOps.degToRad(angle)));
  };

  fixedUpdate(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorCollection.forEach((actor) => {
      const movement = actor.getComponent(Movement);
      const {
        direction, speed, isMoving,
      } = movement;

      if (!isMoving || (direction.x === 0 && direction.y === 0)) {
        return;
      }

      const transform = actor.getComponent(Transform);

      transform.offsetX += direction.x * speed * deltaTimeInSeconds;
      transform.offsetY += direction.y * speed * deltaTimeInSeconds;
    });
  }

  update(): void {
    this.actorCollection.forEach((actor) => {
      const movement = actor.getComponent(Movement);
      const { direction, isMoving } = movement;

      if (!isMoving || (direction.x === 0 && direction.y === 0)) {
        direction.multiplyNumber(0);
        return;
      }

      const viewDirection = actor.getComponent(ViewDirection);

      viewDirection.x = direction.x;
      viewDirection.y = direction.y;

      movement.isMoving = false;
    });
  }
}

MovementSystem.systemName = 'MovementSystem';
