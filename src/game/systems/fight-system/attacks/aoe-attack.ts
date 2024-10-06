import {
  Actor,
  MathOps,
  VectorOps,
  Transform,
  ColliderContainer,
  RigidBody,
} from 'remiz';
import type {
  ActorSpawner,
  Scene,
} from 'remiz';
import { CollisionEnter, AddImpulse } from 'remiz/events';
import type { CollisionEnterEvent } from 'remiz/events';

import * as EventType from '../../../events';
import {
  Weapon,
  HitBox,
  Team,
} from '../../../components';
import type { AOEWeapon } from '../../../components/weapon/aoe-weapon';
import type { CircleCollider } from '../../../../types/collider';
import { findTeam } from '../utils/find-team';

import type { Attack } from './attack';

const EXPLOSION_LIFETIME = 100;

export class AOEAttack implements Attack {
  private actor: Actor;
  private spawner: ActorSpawner;
  private scene: Scene;
  private angle: number;

  private weapon: Weapon;
  private shot: Actor;
  private explosion?: Actor;
  private shotLifetime: number;
  private explosionLifetime: number;
  private isShotFinished: boolean;

  isFinished: boolean;

  constructor(actor: Actor, spawner: ActorSpawner, scene: Scene, angle: number) {
    this.actor = actor;
    this.spawner = spawner;
    this.scene = scene;
    this.angle = angle;

    this.weapon = this.actor.getComponent(Weapon);

    const { offsetX, offsetY } = this.actor.getComponent(Transform);
    const {
      range,
      projectileSpeed,
      projectileModel,
      projectileRadius,
    } = this.weapon.properties as AOEWeapon;

    const shot = this.spawner.spawn(projectileModel);
    const shotTransform = shot.getComponent(Transform);
    const shotCollider = shot.getComponent(ColliderContainer).collider as CircleCollider;

    shotCollider.radius = projectileRadius;

    shotTransform.offsetX = offsetX;
    shotTransform.offsetY = offsetY;
    shotTransform.rotation = MathOps.radToDeg(this.angle);

    this.scene.appendChild(shot);

    const directionVector = VectorOps.getVectorByAngle(this.angle);

    directionVector.multiplyNumber(projectileSpeed);

    const flightTime = 1000 * (range / projectileSpeed);

    this.shot = shot;
    this.shotLifetime = flightTime;
    this.explosionLifetime = EXPLOSION_LIFETIME;
    this.isShotFinished = false;
    this.isFinished = false;

    this.shot.dispatchEvent(AddImpulse, { value: directionVector.clone() });

    this.shot.addEventListener(CollisionEnter, this.handleShotCollisionEnter);
  }

  destroy(): void {
    this.shot.removeEventListener(CollisionEnter, this.handleShotCollisionEnter);
    this.explosion?.removeEventListener(CollisionEnter, this.handleExplosionCollisionEnter);
  }

  private explode(): void {
    if (this.explosion) {
      return;
    }

    const { explosionModel, explosionRadius } = this.weapon.properties as AOEWeapon;

    const explosion = this.spawner.spawn(explosionModel);
    const explosionTransform = explosion.getComponent(Transform);
    const explosionCollider = explosion.getComponent(ColliderContainer).collider as CircleCollider;

    const shotTransform = this.shot.getComponent(Transform);

    explosionTransform.offsetX = shotTransform.offsetX;
    explosionTransform.offsetY = shotTransform.offsetY;
    explosionCollider.radius = explosionRadius;

    this.scene.appendChild(explosion);

    this.explosion = explosion;
    this.explosion.addEventListener(CollisionEnter, this.handleExplosionCollisionEnter);
  }

  private handleShotCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const team = this.actor.getComponent(Team);

    const hitBox = actor.getComponent(HitBox);
    const rigidBody = actor.getComponent(RigidBody);
    const targetTeam = findTeam(actor);
    const target = actor.parent;

    if (team && targetTeam && (team?.index === targetTeam?.index)) {
      return;
    }

    if (rigidBody && !rigidBody.isPermeable && !rigidBody.ghost) {
      this.shotLifetime = 0;
    }

    if (!hitBox || !target || !(target instanceof Actor)) {
      return;
    }

    this.explode();
    this.shotLifetime = 0;
  };

  private handleExplosionCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    const { damage } = this.weapon.properties as AOEWeapon;

    const team = this.actor.getComponent(Team);

    const hitBox = actor.getComponent(HitBox);
    const targetTeam = findTeam(actor);
    const target = actor.parent;

    if (team && targetTeam && (team?.index === targetTeam?.index)) {
      return;
    }

    if (!hitBox || !target || !(target instanceof Actor)) {
      return;
    }

    target.dispatchEvent(EventType.Damage, { value: damage, actor: this.actor });
  };

  update(deltaTime: number): void {
    if (this.isFinished) {
      return;
    }

    this.shotLifetime -= deltaTime;

    if (this.shotLifetime > 0) {
      return;
    }

    if (!this.isShotFinished) {
      this.explode();
      this.shot.dispatchEvent(EventType.Kill, { force: true });
      this.isShotFinished = true;
    }

    this.explosionLifetime -= deltaTime;

    if (this.explosionLifetime <= 0) {
      this.explosion?.dispatchEvent(EventType.Kill, { force: true });
      this.isFinished = true;
    }
  }
}
