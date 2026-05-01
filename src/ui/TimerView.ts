import { Text } from 'pixi.js';
import { GAME_CONFIG } from '../game/GameConfig';

export class TimerView {
  public readonly view: Text;

  public constructor() {
    this.view = new Text({
      text: '',
      style: {
        fill: 0xffffff,
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: '700',
      },
    });

    this.view.anchor.set(1, 0);
    this.view.position.set(GAME_CONFIG.width - 24, 14);
  }

  public setTime(seconds: number): void {
    this.view.text = `Time: ${seconds.toFixed(1)}s`;
  }
}
