import { Container, Graphics, Rectangle, Text } from 'pixi.js';
import { GAME_CONFIG } from '../game/GameConfig';
import type { FederatedPointerEvent } from 'pixi.js';

export class PauseButton {
  public readonly view: Container;

  private readonly label: Text;
  private isEnabled: boolean;

  public constructor(onTogglePause: () => void) {
    this.isEnabled = false;
    this.view = new Container();
    this.view.position.set(GAME_CONFIG.width - 406, 10);
    this.view.eventMode = 'static';
    this.view.cursor = 'default';
    this.view.alpha = 0.45;
    this.view.hitArea = new Rectangle(0, 0, 112, 36);
    this.view.on('pointerdown', (event: FederatedPointerEvent) => {
      event.stopPropagation();

      if (!this.isEnabled) {
        return;
      }

      onTogglePause();
    });

    const background = new Graphics().roundRect(0, 0, 112, 36, 8).fill(0xe2e8f0);
    this.label = new Text({
      text: 'Pause',
      style: {
        fill: 0x0f172a,
        fontFamily: 'Arial',
        fontSize: 17,
        fontWeight: '700',
      },
    });
    this.label.anchor.set(0.5);
    this.label.position.set(56, 18);

    this.view.addChild(background, this.label);
  }

  public setEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled;
    this.view.alpha = isEnabled ? 1 : 0.45;
    this.view.cursor = isEnabled ? 'pointer' : 'default';
  }

  public setPaused(isPaused: boolean): void {
    this.label.text = isPaused ? 'Resume' : 'Pause';
  }
}
