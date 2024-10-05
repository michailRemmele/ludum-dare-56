import { ScriptSystem } from 'remiz';

import {
  SpawnerScript,
} from '../../../src/game/scripts';

import {
  spawnerScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [SpawnerScript.scriptName]: spawnerScript,
  },
};
