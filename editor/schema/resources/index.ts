import { ScriptSystem } from 'remiz';

import {
  SpawnerScript,
  TowerScript,
} from '../../../src/game/scripts';

import {
  spawnerScript,
  towerScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [SpawnerScript.scriptName]: spawnerScript,
    [TowerScript.scriptName]: towerScript,
  },
};
