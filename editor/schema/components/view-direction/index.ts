import type { WidgetSchema } from 'remiz-editor';

export const viewDirection: WidgetSchema = {
  title: 'components.viewDirection.title',
  fields: [
    {
      name: 'x',
      title: 'components.viewDirection.x.title',
      type: 'number',
    },
    {
      name: 'y',
      title: 'components.viewDirection.y.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    x: 0,
    y: 0,
  }),
};
