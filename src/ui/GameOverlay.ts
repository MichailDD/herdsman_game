import { Container, Graphics, Rectangle, Text } from 'pixi.js';
import { GAME_CONFIG } from '../game/GameConfig';
import type { FederatedPointerEvent } from 'pixi.js';

export class GameOverlay {
  public readonly view: Container;

  private readonly title: Text;
  private readonly subtitle: Text;
  private readonly button: Container;
  private readonly buttonLabel: Text;

  public constructor(onRestart: () => void) {
    this.view = new Container();
    this.view.visible = false;

    const backdrop = new Graphics()
      .rect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height)
      .fill({
        color: 0x000000,
        alpha: 0.45,
      });

    this.title = new Text({
      text: '',
      style: {
        fill: 0xffffff,
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: '700',
      },
    });
    this.title.anchor.set(0.5);
    this.title.position.set(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 - 70);

    this.subtitle = new Text({
      text: '',
      style: {
        fill: 0xe5e7eb,
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: '500',
      },
    });
    this.subtitle.anchor.set(0.5);
    this.subtitle.position.set(GAME_CONFIG.width / 2, GAME_CONFIG.height / 2 - 18);

    this.button = this.createButton(onRestart);
    this.button.visible = false;

    this.buttonLabel = new Text({
      text: 'Start again',
      style: {
        fill: 0x172554,
        fontFamily: 'Arial',
        fontSize: 22,
        fontWeight: '700',
      },
    });
    this.buttonLabel.anchor.set(0.5);
    this.buttonLabel.position.set(95, 26);
    this.button.addChild(this.buttonLabel);

    this.view.addChild(backdrop, this.title, this.subtitle, this.button);
  }

  public showCountdown(secondsRemaining: number): void {
    this.view.visible = true;
    this.button.visible = false;
    this.title.text = String(Math.ceil(secondsRemaining));
    this.subtitle.text = 'Get ready';
  }

  public showWin(score: number, elapsedSeconds: number, clicks: number): void {
    this.view.visible = true;
    this.button.visible = true;
    this.title.text = 'All animals are in the yard';
    this.subtitle.text = `Score: ${score} | Time: ${elapsedSeconds.toFixed(1)}s | Clicks: ${clicks}`;
  }

  public hide(): void {
    this.view.visible = false;
  }

  private createButton(onRestart: () => void): Container {
    const button = new Container();
    button.position.set(GAME_CONFIG.width / 2 - 95, GAME_CONFIG.height / 2 + 40);
    button.eventMode = 'static';
    button.cursor = 'pointer';
    button.hitArea = new Rectangle(0, 0, 190, 52);
    button.on('pointerdown', (event: FederatedPointerEvent) => {
      event.stopPropagation();
      onRestart();
    });

    const background = new Graphics().roundRect(0, 0, 190, 52, 8).fill(0xfacc15);
    button.addChild(background);

    return button;
  }
}
