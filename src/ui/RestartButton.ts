import { Container, Graphics, Rectangle, Text } from 'pixi.js';
import { GAME_CONFIG } from '../game/GameConfig';
import type { FederatedPointerEvent } from 'pixi.js';

export class RestartButton {
  public readonly view: Container;

  private isEnabled: boolean;

  public constructor(onRestart: () => void) {
    this.isEnabled = true;
    this.view = new Container();
    this.view.position.set(GAME_CONFIG.width - 530, 10);
    this.view.eventMode = 'static';
    this.view.cursor = 'pointer';
    this.view.hitArea = new Rectangle(0, 0, 112, 36);
    this.view.on('pointerdown', (event: FederatedPointerEvent) => {
      event.stopPropagation();

      if (!this.isEnabled) {
        return;
      }

      onRestart();
    });

    const background = new Graphics().roundRect(0, 0, 112, 36, 8).fill(0xe2e8f0);
    const label = new Text({
      text: 'Restart',
      style: {
        fill: 0x0f172a,
        fontFamily: 'Arial',
        fontSize: 17,
        fontWeight: '700',
      },
    });
    label.anchor.set(0.5);
    label.position.set(56, 18);

    this.view.addChild(background, label);
  }

  public setEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled;
    this.view.alpha = isEnabled ? 1 : 0.45;
    this.view.cursor = isEnabled ? 'pointer' : 'default';
  }
}
