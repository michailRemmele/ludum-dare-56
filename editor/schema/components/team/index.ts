import type { WidgetSchema } from 'remiz-editor';

export const team: WidgetSchema = {
  title: 'components.team.title',
  fields: [
    {
      name: 'index',
      title: 'components.team.index.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    index: 0,
  }),
};
