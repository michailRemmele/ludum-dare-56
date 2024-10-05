import { useMemo } from 'react';
import type { FC } from 'react';
import {
  Widget,
  useExtension,
  useConfig,
} from 'remiz-editor';
import type { WidgetProps } from 'remiz-editor';

const SYSTEM_NAME = 'EffectsSystem';

export const EffectWidget: FC<WidgetProps> = ({
  fields,
  path,
  references,
}) => {
  const { resourcesSchema } = useExtension();

  const scriptPath = useMemo(() => path.concat('script'), [path]);

  const scriptName = useConfig(scriptPath) as string;

  const extendedReferences = useMemo(() => ({
    ...references,
    scripts: {
      items: Object.keys(resourcesSchema[SYSTEM_NAME] || {}).map((key) => ({
        title: key,
        value: key,
      })),
    },
  }), [references]);

  const partFields = resourcesSchema[SYSTEM_NAME]?.[scriptName]?.fields;
  const partReferences = resourcesSchema[SYSTEM_NAME]?.[scriptName]?.references;

  return (
    <>
      <Widget path={path} fields={fields} references={extendedReferences} />
      {partFields && <Widget path={path} fields={partFields} references={partReferences} />}
    </>
  );
};
