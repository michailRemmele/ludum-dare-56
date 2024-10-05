import type { WidgetSchema } from 'remiz-editor';

import { EffectWidget } from './view';

export const effect: WidgetSchema = {
  title: 'components.effect.title',
  fields: [
    {
      name: 'type',
      title: 'components.effect.type.title',
      type: 'select',
      referenceId: 'types',
    },
    {
      name: 'applicatorOptions.timer',
      title: 'components.applicatorOptions.timer.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'delayed',
      },
    },
    {
      name: 'applicatorOptions.frequency',
      title: 'components.applicatorOptions.frequency.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'periodical',
      },
    },
    {
      name: 'applicatorOptions.duration',
      title: 'components.applicatorOptions.duration.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'periodical|timeLimited',
      },
    },
    {
      name: 'applicatorOptions.cooldown',
      title: 'components.applicatorOptions.cooldown.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'periodical',
      },
    },
    {
      name: 'script',
      title: 'components.effect.script.title',
      type: 'select',
      referenceId: 'scripts',
    },
  ],
  references: {
    types: {
      items: [
        {
          title: 'components.effect.types.instant.title',
          value: 'instant',
        },
        {
          title: 'components.effect.types.delayed.title',
          value: 'delayed',
        },
        {
          title: 'components.effect.types.periodical.title',
          value: 'periodical',
        },
        {
          title: 'components.effect.types.continuous.title',
          value: 'continuous',
        },
        {
          title: 'components.effect.types.timeLimited.title',
          value: 'timeLimited',
        },
      ],
    },
  },
  view: EffectWidget,
  getInitialState: () => ({
    type: 'instant',
    applicatorOptions: {},
    script: '',
  }),
};
