import type { WidgetSchema } from 'remiz-editor';

export const money: WidgetSchema = {
  title: 'components.money.title',
  fields: [
    {
      name: 'value',
      title: 'components.money.value.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    value: 0,
  }),
};
