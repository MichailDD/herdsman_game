import { Graphics, Text } from 'pixi.js';
import { GAME_CONFIG } from '../game/GameConfig';
import { Entity } from './Entity';
import type { PointData } from 'pixi.js';

export class Yard extends Entity {
  public constructor() {
    super();

    const body = new Graphics()
      .rect(0, 0, GAME_CONFIG.yard.width, GAME_CONFIG.yard.height)
      .fill(GAME_CONFIG.yard.color)
      .stroke({
        color: 0xa16207,
        width: 4,
      });

    const label = new Text({
      text: 'Yard',
      style: {
        fill: 0x713f12,
        fontFamily: 'Arial',
        fontSize: 22,
        fontWeight: '700',
      },
    });
    label.anchor.set(0.5);
    label.position.set(GAME_CONFIG.yard.width / 2, GAME_CONFIG.yard.height / 2);

    this.view.addChild(body, label);
  }

  public contains(position: PointData): boolean {
    return (
      position.x >= this.view.x &&
      position.x <= this.view.x + GAME_CONFIG.yard.width &&
      position.y >= this.view.y &&
      position.y <= this.view.y + GAME_CONFIG.yard.height
    );
  }
}
