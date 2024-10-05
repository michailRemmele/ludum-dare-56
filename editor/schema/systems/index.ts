import type { WidgetSchema } from 'remiz-editor';

import {
  ScenarioSystem,
  MovementSystem,
  FightSystem,
  Reaper,
} from '../../../src/game/systems';

import { scenarioSystem } from './scenario-system';
import { movementSystem } from './movement-system';
import { fightSystem } from './fight-system';
import { reaper } from './reaper';

export const systemsSchema: Record<string, WidgetSchema> = {
  [ScenarioSystem.systemName]: scenarioSystem,
  [MovementSystem.systemName]: movementSystem,
  [FightSystem.systemName]: fightSystem,
  [Reaper.systemName]: reaper,
};
