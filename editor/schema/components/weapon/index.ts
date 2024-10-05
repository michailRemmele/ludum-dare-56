import type { WidgetSchema } from 'remiz-editor';
import type { FC } from 'react';

import { WeaponWidget } from './view';

export const weapon: WidgetSchema = {
  title: 'components.weapon.title',
  fields: [
    {
      name: 'type',
      title: 'components.weapon.type.title',
      type: 'select',
      referenceId: 'types',
    },
    {
      name: 'cooldown',
      title: 'components.weapon.cooldown.title',
      type: 'number',
    },
    {
      name: 'properties.damage',
      title: 'components.weapon.properties.damage.title',
      type: 'number',
    },
    {
      name: 'properties.range',
      title: 'components.weapon.properties.range.title',
      type: 'number',
    },
    {
      name: 'properties.projectileSpeed',
      title: 'components.weapon.properties.projectileSpeed.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'range|aoe|freeze',
      },
    },
    {
      name: 'properties.projectileRadius',
      title: 'components.weapon.properties.projectileRadius.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'range|aoe|freeze',
      },
    },
    {
      name: 'properties.projectileModel',
      title: 'components.weapon.properties.projectileModel.title',
      type: 'select',
      referenceId: 'models',
      dependency: {
        name: 'type',
        value: 'range|aoe|freeze',
      },
    },
    {
      name: 'properties.explosionRadius',
      title: 'components.weapon.properties.explosionRadius.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'aoe|freeze',
      },
    },
    {
      name: 'properties.explosionModel',
      title: 'components.weapon.properties.explosionModel.title',
      type: 'select',
      referenceId: 'models',
      dependency: {
        name: 'type',
        value: 'aoe|freeze',
      },
    },
    {
      name: 'properties.slowFactor',
      title: 'components.weapon.properties.slowFactor.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'freeze',
      },
    },
  ],
  references: {
    types: {
      items: [
        {
          title: 'components.weapon.types.melee.title',
          value: 'melee',
        },
        {
          title: 'components.weapon.types.range.title',
          value: 'range',
        },
        {
          title: 'components.weapon.types.aoe.title',
          value: 'aoe',
        },
        {
          title: 'components.weapon.types.freeze.title',
          value: 'freeze',
        },
      ],
    },
  },
  view: WeaponWidget as FC,
  getInitialState: () => ({
    type: 'melee',
    cooldown: 1000,
    properties: {
      damage: 1,
      range: 10,
    },
  }),
};
