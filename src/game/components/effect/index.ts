import { Component } from 'remiz';

import type {
  EffectType,
  DelayedEffectOptions,
  PeriodicalEffectOptions,
  TimeLimitedEffectOptions,
} from './types';

const REMOVE_TIMEOUT = 5000;

interface EffectConfig {
  script: string
  type: EffectType
  options: Record<string, unknown>
  applicatorOptions?: DelayedEffectOptions | PeriodicalEffectOptions | TimeLimitedEffectOptions;
}

export class Effect extends Component {
  script: string;
  type: EffectType;
  options: Record<string, unknown>;
  applicatorOptions?: DelayedEffectOptions | PeriodicalEffectOptions | TimeLimitedEffectOptions;
  isCancelled: boolean;
  removeTimeout: number;

  constructor(config: EffectConfig) {
    super();

    this.script = config.script;
    this.type = config.type;
    this.options = { ...config.options };

    if (config.applicatorOptions) {
      this.applicatorOptions = { ...config.applicatorOptions };
    }

    this.isCancelled = false;
    this.removeTimeout = REMOVE_TIMEOUT;
  }

  clone(): Effect {
    return new Effect({
      script: this.script,
      type: this.type,
      options: this.options,
      applicatorOptions: this.applicatorOptions,
    });
  }
}

Effect.componentName = 'Effect';
