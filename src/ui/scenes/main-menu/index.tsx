import {useCallback, useContext, useState} from 'react';
import type {FC} from 'react';
import {LoadLevel, LoadScene} from 'remiz/events';

import {Button} from '../../components';
import {EngineContext} from '../../providers';
import {GAME_ID, MAIN_MENU_ID} from '../../../consts/scenes';

import './style.css';
import {LEVELS_ITERABLE} from "../../../consts/levels.ts";
import {storage} from "../../../utils/local-storage.ts";

export const MainMenu: FC = () => {
  const {scene} = useContext(EngineContext);
  const [levelChangeScreen, goToLevelChangeScreen] = useState(false);

  const handlePlay = useCallback(() => {
    console.log('PLAY');
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

  const handleLevelChange = (id, index) => {
    console.log('handleLevelChange', id);
    storage.set('current_level', index);
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      clean: true,
      loaderId: null,
      levelId: id,
    });
  }

  const handleReset = () => {
    storage.clear();
    scene.dispatchEvent(LoadScene, {
      sceneId: MAIN_MENU_ID,
      clean: true,
      loaderId: null,
      levelId: null,
    });
  }

  return (
    <div className="main-menu">
      {levelChangeScreen &&
        <>
          <h1 style={{ textAlign: 'center' }}>It seems you've made some progress last time. <br/> Choose where do you want to pick up!</h1>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {LEVELS_ITERABLE.map((item, index) => {
              const playable = storage.get(item) || index === 0; // true | false | undefined
              const Tag = ({as, ...props}) => as === 'button'
                ? <Button type="button" styles={{ minWidth: 185 }} {...props} />
                : <Button
                    disabled
                    styles={{ color: 'gray', borderColor: 'gray', minWidth: 185}}
                    {...props}
                  />;
              return (
                <li style={{ marginBottom: '10px' }} key={item}>
                  <Tag as={playable ? 'button' : 'null'} onClick={playable ? () => handleLevelChange(item, index) : null}>
                    Level {index}
                  </Tag>
                </li>
              )
            })}
          </ul>
          <Button onClick={handleReset}>Reset All</Button>
        </>
      }
      {!levelChangeScreen &&
        <>
          <h1>Ludum Dare 56</h1>
          <Button onClick={handlePlay}>Play</Button>
        </>
      }
    </div>
  );
};
