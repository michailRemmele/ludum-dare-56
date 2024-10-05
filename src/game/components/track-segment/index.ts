import { Component } from "remiz";

interface TrackSegmentConfig {
  next: string;
}

export class TrackSegment extends Component {
  next: string;

  constructor(config: TrackSegmentConfig) {
    super();

    this.next = config?.next;
  }

  clone(): TrackSegment {
    return new TrackSegment({ next: this.next });
  }
}

TrackSegment.componentName = "TrackSegment";
