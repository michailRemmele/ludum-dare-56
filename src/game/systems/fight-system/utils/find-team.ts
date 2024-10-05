import { Actor } from 'remiz';

import { Team } from '../../../components';

export const findTeam = (actor: Actor): Team | null => {
  const team = actor.getComponent(Team);

  if (team !== undefined) {
    return team;
  }

  if (actor.parent === null || !(actor.parent instanceof Actor)) {
    return null;
  }

  return findTeam(actor.parent);
};
