import { Component } from 'remiz';

export class Money extends Component {
  value: number;

  constructor() {
    super();

    this.value = 0;
  }

  clone(): Money {
    return new Money();
  }
}

Money.componentName = 'Money';
