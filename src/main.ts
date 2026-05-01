import './style.css';
import { Game } from './game/Game';

const root = document.querySelector<HTMLElement>('#app');

if (!root) {
  throw new Error('Application root element was not found.');
}

const game = new Game(root);

void game.start();
