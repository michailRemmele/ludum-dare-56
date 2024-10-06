import type { WidgetSchema } from 'remiz-editor';

import {
  Money,
  TrackSegment,
  Movement,
  ViewDirection,
  Health,
  HitBox,
  Weapon,
  Team,
  Effect,
  Tier,
  Level,
} from '../../../src/game/components';

import { money } from './money';
import { trackSegment } from './track-segment';
import { movement } from './movement';
import { viewDirection } from './view-direction';
import { health } from './health';
import { hitBox } from './hit-box';
import { weapon } from './weapon';
import { team } from './team';
import { effect } from './effect';
import { tier } from './tier';
import { level } from './level';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Money.componentName]: money,
  [TrackSegment.componentName]: trackSegment,
  [Movement.componentName]: movement,
  [ViewDirection.componentName]: viewDirection,
  [Health.componentName]: health,
  [HitBox.componentName]: hitBox,
  [Weapon.componentName]: weapon,
  [Team.componentName]: team,
  [Effect.componentName]: effect,
  [Tier.componentName]: tier,
  [Level.componentName]: level,
};
