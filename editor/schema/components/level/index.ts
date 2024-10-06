import type { WidgetSchema } from 'remiz-editor';

export const level: WidgetSchema = {
  title: 'components.level.title',
  fields: [
    {
      name: 'index',
      title: 'components.level.index.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    index: 0,
  }),
};
