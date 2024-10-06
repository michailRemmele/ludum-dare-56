import { Component } from 'remiz';

interface MoneyConfig {
  value: number
}

export class Money extends Component {
  value: number;

  constructor(conig: MoneyConfig) {
    super();

    this.value = conig.value;
  }

  clone(): Money {
    return new Money({ value: this.value });
  }
}

Money.componentName = 'Money';
