import { ScriptSystem } from 'remiz';

import {
  SpawnerScript,
  TowerScript,
  DeathTrackerScript,
  PlayerScript,
  BaseScript,
} from '../../../src/game/scripts';

import {
  spawnerScript,
  towerScript,
  deathTrackerScript,
  playerScript,
  baseScript,
} from './script-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [SpawnerScript.scriptName]: spawnerScript,
    [TowerScript.scriptName]: towerScript,
    [DeathTrackerScript.scriptName]: deathTrackerScript,
    [PlayerScript.scriptName]: playerScript,
    [BaseScript.scriptName]: baseScript,
  },
};
