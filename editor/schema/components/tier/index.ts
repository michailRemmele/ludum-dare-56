import type { WidgetSchema } from 'remiz-editor';

export const tier: WidgetSchema = {
  title: 'components.tier.title',
  fields: [
    {
      name: 'index',
      title: 'components.tier.index.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    index: 0,
  }),
};
