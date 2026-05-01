import { Text } from 'pixi.js';
import { GAME_CONFIG } from '../game/GameConfig';

export class ClicksView {
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
    this.view.position.set(GAME_CONFIG.width - 164, 14);
  }

  public setClicks(clicks: number): void {
    this.view.text = `Clicks: ${clicks}`;
  }
}
