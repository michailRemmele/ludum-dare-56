import type { WidgetSchema } from 'remiz-editor';

import { ScenarioSystem } from '../../../src/game/systems';

import { scenarioSystem } from './scenario-system';

export const systemsSchema: Record<string, WidgetSchema> = {
  [ScenarioSystem.systemName]: scenarioSystem,
};
