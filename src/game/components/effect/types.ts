export type EffectType = 'instant' | 'delayed' | 'periodical' | 'continuous' | 'timeLimited';

export interface DelayedEffectOptions {
  timer: number
}

export interface PeriodicalEffectOptions {
  frequency: number
  duration: number
  cooldown: number
}

export interface TimeLimitedEffectOptions {
  duration: number
}
