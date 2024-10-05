import { Component } from 'remiz';
import type { Actor } from 'remiz';

export interface ActiveEffectsConfig {
  list: Array<string>
  map: Record<string, Actor>
}

export class ActiveEffects extends Component {
  list: Array<string>;
  map: Record<string, Actor>;

  constructor(config?: ActiveEffectsConfig) {
    super();

    this.list = config ? [...config.list] : [];
    this.map = config ? { ...config.map } : {};
  }

  clone(): ActiveEffects {
    return new ActiveEffects({
      list: this.list,
      map: this.map,
    });
  }
}

ActiveEffects.componentName = 'ActiveEffects';
