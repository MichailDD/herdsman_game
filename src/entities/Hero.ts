import { Graphics } from 'pixi.js';
import { GAME_CONFIG } from '../game/GameConfig';
import { moveTowards } from '../utils/math';
import { Entity } from './Entity';
import type { PointData } from 'pixi.js';

export class Hero extends Entity {
  private targetPosition: PointData;

  public constructor() {
    super();
    this.targetPosition = GAME_CONFIG.hero.startPosition;

    const body = new Graphics()
      .circle(0, 0, GAME_CONFIG.hero.radius)
      .fill(GAME_CONFIG.hero.color)
      .stroke({
        color: 0x7f1d1d,
        width: 3,
      });

    this.view.addChild(body);
  }

  public setTarget(position: PointData): void {
    this.targetPosition = position;
  }

  public reset(position: PointData): void {
    super.setPosition(position);
    this.targetPosition = position;
  }

  public update(deltaSeconds: number): void {
    const nextPosition = moveTowards(
      this.position,
      this.targetPosition,
      GAME_CONFIG.hero.speed * deltaSeconds,
    );

    this.setPosition(nextPosition);
  }
}
