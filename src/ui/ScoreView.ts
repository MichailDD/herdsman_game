import { Text } from 'pixi.js';

export class ScoreView {
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

    this.view.position.set(24, 14);
  }

  public setScore(score: number): void {
    this.view.text = `Score: ${score}`;
  }
}
