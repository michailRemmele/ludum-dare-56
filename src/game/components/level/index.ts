import { Component } from 'remiz';

interface LevelConfig {
  index: number
}

export class Level extends Component {
  index: number;

  constructor(config: LevelConfig) {
    super();

    const { index } = config;

    this.index = index;
  }

  clone(): Level {
    return new Level({ index: this.index });
  }
}

Level.componentName = 'Level';
