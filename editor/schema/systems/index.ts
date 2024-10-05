import type { WidgetSchema } from 'remiz-editor';

import {
  ScenarioSystem,
  MovementSystem,
} from '../../../src/game/systems';

import { scenarioSystem } from './scenario-system';
import { movementSystem } from './movement-system';

export const systemsSchema: Record<string, WidgetSchema> = {
  [ScenarioSystem.systemName]: scenarioSystem,
  [MovementSystem.systemName]: movementSystem,
};
