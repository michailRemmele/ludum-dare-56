import {
  useEffect,
  useContext,
  useState,
} from 'react';
import type { FC } from 'react';
import {LoadLevel, LoadScene} from 'remiz/events';

import { EngineContext } from '../../providers';
import {
  Button,
} from '../../components';
import {GAME_ID, MAIN_MENU_ID} from '../../../consts/scenes';
import * as EventType from '../../../game/events';
import type { GameOverEvent } from '../../../game/events';
import { storage } from '../../../utils/local-storage.ts';

import {
  MoneyBar,
  BaseHealthBar,
  ConstructionMenu,
  ProgressInfo,
} from './components';
import './style.css';
import {LEVELS_ITERABLE} from "../../../consts/levels.ts";

export const Game: FC = () => {
  const { scene } = useContext(EngineContext);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [currentLevelIndex] = useState(Number(storage.get('current_level')) || 0);

  useEffect(() => {
    const handleGameOver = (event: GameOverEvent): void => {
      storage.set(LEVELS_ITERABLE[currentLevelIndex], event.isWin);
      storage.set('game_started', true);
      setIsGameOver(true);
      setIsWin(event.isWin);
    };

    scene.addEventListener(EventType.GameOver, handleGameOver);
  }, []);

  const handleRestart = (): void => {
    let nextLevel = currentLevelIndex;
    if (storage.get(LEVELS_ITERABLE[currentLevelIndex]) !== false) {
      nextLevel = Number(currentLevelIndex) + 1;
    }
    if (nextLevel >= LEVELS_ITERABLE.length) {
      storage.set('current_level', String(0));
      scene.dispatchEvent(LoadLevel, {
        loaderId: null,
        levelId: LEVELS_ITERABLE[0],
      });
    } else {
      storage.set('current_level', String(nextLevel));
      scene.dispatchEvent(LoadLevel, {
        loaderId: null,
        levelId: LEVELS_ITERABLE[nextLevel],
      });
    }
  };

  const handleMainMenu = () => {
    scene.dispatchEvent(LoadScene, {
      sceneId: MAIN_MENU_ID,
      clean: true,
      loaderId: null,
      levelId: null,
    });
  }

  return (
    <div className="game">
      <header className="game__header">
        <div className="header__left">
          <BaseHealthBar />
          <ProgressInfo />
        </div>
        <MoneyBar />
      </header>

      <ConstructionMenu />

      {isGameOver && (
      <div className="game-over__overlay">
        <div className="game-over__content">
          <h1 className="game-over__title">
            {isWin ? 'Victory!' : 'Game Over'}
          </h1>
          {
            LEVELS_ITERABLE[currentLevelIndex + 1] !== undefined && isWin &&
            <Button onClick={handleRestart}>
              Continue
            </Button>
          }
          {
            LEVELS_ITERABLE[currentLevelIndex + 1] !== undefined && !isWin &&
            <Button onClick={handleRestart}>
              Restart
            </Button>
          }
          {
            LEVELS_ITERABLE[currentLevelIndex + 1] === undefined &&
            <Button onClick={handleMainMenu}>
              Back to Main Menu
            </Button>
          }

        </div>
      </div>
      )}
    </div>
  );
};
