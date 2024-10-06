import { Component } from 'remiz';

export class Tier extends Component {
  index: number;

  constructor() {
    super();

    this.index = 0;
  }

  clone(): Tier {
    return new Tier();
  }
}

Tier.componentName = 'Tier';
