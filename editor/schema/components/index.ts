import type { WidgetSchema } from 'remiz-editor';

import {
  Orb,
  SnakeSegment,
  Score,
  TrackSegment,
} from '../../../src/game/components';

import { orb } from './orb';
import { snakeSegment } from './snake-segment';
import { score } from './score';
import { trackSegment } from './track-segment';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Orb.componentName]: orb,
  [SnakeSegment.componentName]: snakeSegment,
  [Score.componentName]: score,
  [TrackSegment.componentName]: trackSegment,
};
