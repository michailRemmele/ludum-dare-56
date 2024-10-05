import type { WidgetSchema } from 'remiz-editor';

import {
  Money,
  TrackSegment,
  Movement,
  ViewDirection,
} from '../../../src/game/components';

import { money } from './money';
import { trackSegment } from './track-segment';
import { movement } from './movement';
import { viewDirection } from './view-direction';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Money.componentName]: money,
  [TrackSegment.componentName]: trackSegment,
  [Movement.componentName]: movement,
  [ViewDirection.componentName]: viewDirection,
};
