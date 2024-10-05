import type { WidgetPartSchema } from 'remiz-editor';

export const spawnerScript: WidgetPartSchema = {
  fields: [
    {
      name: 'sizeX',
      title: 'resources.scriptSystem.spawnerScript.sizeX.title',
      type: 'number',
    },
    {
      name: 'sizeY',
      title: 'resources.scriptSystem.spawnerScript.sizeY.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    sizeX: 0,
    sizeY: 0,
  }),
};
