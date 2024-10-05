import { Component, Vector2 } from 'remiz';

interface MovementConfig {
  speed: number
}

export class Movement extends Component {
  speed: number;
  maxSpeed: number;
  direction: Vector2;
  isMoving: boolean;

  constructor(config: MovementConfig) {
    super();

    this.speed = config.speed;
    this.maxSpeed = config.speed;
    this.direction = new Vector2(0, 0);
    this.isMoving = false;
  }

  clone(): Movement {
    return new Movement({
      speed: this.speed,
    });
  }
}

Movement.componentName = 'Movement';
