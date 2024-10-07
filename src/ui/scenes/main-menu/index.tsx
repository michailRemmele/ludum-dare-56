import { useCallback, useContext, useState } from 'react';
import type { FC } from 'react';
import { LoadScene } from 'remiz/events';

import { Button } from '../../components';
import { EngineContext } from '../../providers';
import { GAME_ID, MAIN_MENU_ID } from '../../../consts/scenes';
import { LEVELS_ITERABLE } from '../../../consts/levels';
import { storage } from '../../../utils/local-storage';

import './style.css';

export const MainMenu: FC = () => {
  const { scene } = useContext(EngineContext);
  const [levelChangeScreen, goToLevelChangeScreen] = useState(false);

  const handlePlay = useCallback(() => {
    if (storage.get('game_started')) {
      goToLevelChangeScreen(true);
    } else {
      scene.dispatchEvent(LoadScene, {
        sceneId: GAME_ID,
        clean: true,
        loaderId: null,
        levelId: LEVELS_ITERABLE[Number(storage.get('current_level'))],
      });
    }
  }, [scene]);

  const handleLevelChange = (id: string, index: number): void => {
    storage.set('current_level', index);
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      clean: true,
      loaderId: null,
      levelId: id,
    });
  };

  const handleReset = (): void => {
    storage.clear();
    scene.dispatchEvent(LoadScene, {
      sceneId: MAIN_MENU_ID,
      clean: true,
      loaderId: null,
      levelId: null,
    });
  };

  return (
    <div className="main-menu">
      {levelChangeScreen
        && (
        <>
          <h1 style={{ textAlign: 'center' }}>
            It seems you&apos;ve made some progress last time.
            <br />
            {' '}
            Choose where do you want to pick up!
          </h1>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {LEVELS_ITERABLE.map((item, index) => {
              const playable = storage.get(item)?.available || index === 0; // true | false | undefined
              const Tag = ({ as, ...props }) => (as === 'button'
                ? <Button type="button" styles={{ minWidth: 185 }} {...props} />
                : (
                  <Button
                    disabled
                    styles={{ color: 'gray', borderColor: 'gray', minWidth: 185 }}
                    {...props}
                  />
                ));
              return (
                <li style={{ marginBottom: '10px' }} key={item}>
                  <Tag as={playable ? 'button' : 'null'} onClick={playable ? () => handleLevelChange(item, index) : null}>
                    Level
                    {' '}
                    {index}
                  </Tag>
                </li>
              );
            })}
          </ul>
          <Button onClick={handleReset}>Reset All</Button>
        </>
        )}
      {!levelChangeScreen
        && (
        <>
          <img
            src="./images/logo.png"
            alt="Long Live Dacha!"
            className="main-menu__logo"
          />
          <Button onClick={handlePlay}>Play</Button>
        </>
        )}
    </div>
  );
};
