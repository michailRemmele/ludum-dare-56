import { Component } from 'remiz';

interface TrackSegmentConfig {
  index: number
}

export class TrackSegment extends Component {
  index: number;

  constructor(config: TrackSegmentConfig) {
    super();

    this.index = config.index;
  }

  clone(): TrackSegment {
    return new TrackSegment({ index: this.index });
  }
}

TrackSegment.componentName = 'TrackSegment';
