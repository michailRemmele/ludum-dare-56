import type {
  Actor,
  ActorSpawner,
  ScriptOptions,
} from 'remiz';
import {
  Script,
} from 'remiz';

import { TOWER_SELECTION_ID } from '../../../consts/templates';
import * as EventType from '../../events';

export class SpotScript extends Script {
  private actor: Actor;
  private actorSpawner: ActorSpawner;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;
    this.actorSpawner = options.actorSpawner;

    this.actor.addEventListener(EventType.Select, this.handleSelect);
    this.actor.addEventListener(EventType.Unselect, this.handleUnselect);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.Select, this.handleSelect);
    this.actor.removeEventListener(EventType.Unselect, this.handleUnselect);
  }

  private handleSelect = (): void => {
    const selection = this.actorSpawner.spawn(TOWER_SELECTION_ID);
    this.actor.appendChild(selection);
  };

  private handleUnselect = (): void => {
    let index = 0;
    while (index < this.actor.children.length) {
      if (this.actor.children[index].templateId === TOWER_SELECTION_ID) {
        this.actor.children[index].remove();
      } else {
        index += 1;
      }
    }
  };
}

SpotScript.scriptName = 'SpotScript';
