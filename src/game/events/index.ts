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
export const BuildTower = 'BuildTower';
export const UpgradeTower = 'UpgradeTower';
export const Select = 'Select';
export const Unselect = 'Unselect';
export const AddEffect = 'AddEffect';
export const RemoveEffect = 'RemoveEffect';
export const ApplyEffect = 'ApplyEffect';
export const CancelEffect = 'CancelEffect';

export type MoveEvent = ActorEvent<{
  angle: number
}>;

export type AttackInputEvent = ActorEvent<{ x: number, y: number }>;
export type AttackEvent = ActorEvent<{ x: number, y: number }>;
export type DamageEvent = ActorEvent<{ value: number, actor?: Actor }>;
export type ProvokeEvent = ActorEvent<{ actor: Actor }>;
export type KillEvent = ActorEvent<{ force?: boolean }>;
export type UpgradeTowerEvent = ActorEvent<{ cost: number, weapon: Record<string, number> }>;
export type AddEffectEvent = ActorEvent<{
  id: string
  options: Record<string, unknown>
}>;

export type RemoveEffectEvent = ActorEvent<{
  id: string
  options: Record<string, unknown>
}>;

export type GameOverEvent = SceneEvent<{ isWin: boolean }>;
export type SpawnCreatureEvent = SceneEvent<{ templateId: string, quantity: number }>;
export type MoneyUpdateEvent = SceneEvent<{ money: number }>;
export type EnemyDeathEvent = SceneEvent<{ withoutReward?: boolean }>;
export type BuildTowerEvent = SceneEvent<{ id: string, cost: number, spotId: string }>;

declare module 'remiz' {
  export interface ActorEventMap {
    [Movement]: MoveEvent
    [AttackInput]: AttackInputEvent
    [Attack]: ActorEvent
    [Kill]: KillEvent
    [Damage]: DamageEvent
    [Select]: ActorEvent
    [Unselect]: ActorEvent
    [UpgradeTower]: UpgradeTowerEvent
    [AddEffect]: AddEffectEvent
    [RemoveEffect]: RemoveEffectEvent
    [ApplyEffect]: ActorEvent
    [CancelEffect]: ActorEvent
  }

  export interface SceneEventMap {
    [GameOver]: GameOverEvent
    [SpawnCreature]: SpawnCreatureEvent
    [EnemyDeath]: EnemyDeathEvent
    [NextWave]: SceneEvent
    [MoneyUpdate]: MoneyUpdateEvent
    [BuildTower]: BuildTowerEvent
  }
}
