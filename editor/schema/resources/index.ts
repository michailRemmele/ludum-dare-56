import { ScriptSystem } from 'remiz';

import { EffectsSystem } from '../../../src/game/systems';

import {
  SpawnerScript,
  TowerScript,
  DeathTrackerScript,
  PlayerScript,
  BaseScript,
  SpotScript,
  BackgroundScript,
} from '../../../src/game/scripts';
import { } from '../../../src/game/effects';

import {
  spawnerScript,
  towerScript,
  deathTrackerScript,
  playerScript,
  baseScript,
  spotScript,
  backgroundScript,
} from './script-system';
import { freezeScript } from './effects-system';

export const resourcesSchema = {
  [ScriptSystem.systemName]: {
    [SpawnerScript.scriptName]: spawnerScript,
    [TowerScript.scriptName]: towerScript,
    [DeathTrackerScript.scriptName]: deathTrackerScript,
    [PlayerScript.scriptName]: playerScript,
    [BaseScript.scriptName]: baseScript,
    [SpotScript.scriptName]: spotScript,
    [BackgroundScript.scriptName]: backgroundScript,
  },
  [EffectsSystem.systemName]: {
    freeze: freezeScript,
  },
};
