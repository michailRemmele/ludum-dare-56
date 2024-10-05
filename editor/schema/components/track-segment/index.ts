import type { WidgetSchema } from 'remiz-editor';

export const trackSegment: WidgetSchema = {
  title: 'components.trackSegment.title',
  fields: [
    {
      name: 'index',
      title: 'components.trackSegment.index.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    index: 0,
  }),
};
