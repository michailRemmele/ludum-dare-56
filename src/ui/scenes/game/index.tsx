import {
  useEffect,
  useContext,
  useState,
} from 'react';
import type { FC } from 'react';
import { LoadScene } from 'remiz/events';

import { EngineContext } from '../../providers';
import {
  Button,
} from '../../components';
import { GAME_ID } from '../../../consts/scenes';
import * as EventType from '../../../game/events';
import type { GameOverEvent } from '../../../game/events';

import {
  MoneyBar,
  BaseHealthBar,
} from './components';
import './style.css';

export const Game: FC = () => {
  const { scene } = useContext(EngineContext);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    const handleGameOver = (event: GameOverEvent): void => {
      setIsGameOver(true);
      setIsWin(event.isWin);
    };

    scene.addEventListener(EventType.GameOver, handleGameOver);
  }, []);

  const handleRestart = (): void => {
    scene.dispatchEvent(LoadScene, {
      sceneId: GAME_ID,
      loaderId: null,
      levelId: null,
      unloadCurrent: true,
      clean: true,
    });
  };

  return (
    <div className="game">
      <header className="game__header">
        <BaseHealthBar />
        <div className="header__left">
          <MoneyBar />
        </div>
      </header>

      {isGameOver && (
      <div className="game-over__overlay">
        <div className="game-over__content">
          <h1 className="game-over__title">
            {isWin ? 'Victory' : 'Game Over'}
          </h1>
          <Button onClick={handleRestart}>Restart</Button>
        </div>
      </div>
      )}
    </div>
  );
};
