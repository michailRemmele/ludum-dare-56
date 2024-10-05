import type { ActorEvent, SceneEvent, Actor } from 'remiz';

export const Movement = 'Movement';
export const AttackInput = 'AttackInput';
export const Attack = 'Attack';
export const Kill = 'Kill';
export const Damage = 'Damage';
export const GameOver = 'GameOver';
export const SpawnCreature = 'SpawnCreature';
export const EnemyDeath = 'EnemyDeath';
export const NextWave = 'NextWave';
export const MoneyUpdate = 'MoneyUpdate';

export type MoveEvent = ActorEvent<{
  angle: number
}>;

export type AttackInputEvent = ActorEvent<{ x: number, y: number }>;
export type AttackEvent = ActorEvent<{ x: number, y: number }>;
export type DamageEvent = ActorEvent<{ value: number, actor?: Actor }>;
export type ProvokeEvent = ActorEvent<{ actor: Actor }>;

export type GameOverEvent = SceneEvent<{ isWin: boolean }>;
export type SpawnCreatureEvent = SceneEvent<{ templateId: string, quantity: number }>;
export type MoneyUpdateEvent = SceneEvent<{ money: number }>;

declare module 'remiz' {
  export interface ActorEventMap {
    [Movement]: MoveEvent
    [AttackInput]: AttackInputEvent
    [Attack]: ActorEvent
    [Kill]: ActorEvent
    [Damage]: DamageEvent
  }

  export interface SceneEventMap {
    [GameOver]: GameOverEvent
    [SpawnCreature]: SpawnCreatureEvent
    [EnemyDeath]: SceneEvent
    [NextWave]: SceneEvent
    [MoneyUpdate]: MoneyUpdateEvent
  }
}
