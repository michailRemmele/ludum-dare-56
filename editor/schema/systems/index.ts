import type { WidgetSchema } from 'remiz-editor';

import {
  ScenarioSystem,
  MovementSystem,
  TrackSystem,
  FightSystem,
  Reaper,
  EffectsSystem,
} from '../../../src/game/systems';

import { scenarioSystem } from './scenario-system';
import { movementSystem } from './movement-system';
import { fightSystem } from './fight-system';
import { trackSystem } from './track-system';
import { reaper } from './reaper';
import { effectsSystem } from './effect-system';

export const systemsSchema: Record<string, WidgetSchema> = {
  [ScenarioSystem.systemName]: scenarioSystem,
  [MovementSystem.systemName]: movementSystem,
  [TrackSystem.systemName]: trackSystem,
  [FightSystem.systemName]: fightSystem,
  [Reaper.systemName]: reaper,
  [EffectsSystem.systemName]: effectsSystem,
};
