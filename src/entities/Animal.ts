import { Graphics } from 'pixi.js';
import { GAME_CONFIG } from '../game/GameConfig';
import { distanceBetween, moveTowards } from '../utils/math';
import { Entity } from './Entity';
import type { PointData } from 'pixi.js';

export type AnimalState = 'idle' | 'following' | 'delivered';

export class Animal extends Entity {
  public state: AnimalState;

  public constructor() {
    super();
    this.state = 'idle';

    const body = new Graphics()
      .circle(0, 0, GAME_CONFIG.animal.radius)
      .fill(GAME_CONFIG.animal.color)
      .stroke({
        color: 0xcbd5e1,
        width: 2,
      });

    this.view.addChild(body);
  }

  public startFollowing(): void {
    this.state = 'following';
  }

  public markDelivered(): void {
    this.state = 'delivered';
  }

  public follow(target: PointData, deltaSeconds: number): void {
    const distanceToTarget = distanceBetween(this.position, target);

    if (distanceToTarget <= GAME_CONFIG.animal.followDistance) {
      return;
    }

    const catchUpSpeed =
      GAME_CONFIG.animal.followSpeed +
      (distanceToTarget - GAME_CONFIG.animal.followDistance) *
        GAME_CONFIG.animal.catchUpSpeedMultiplier;
    const speed = Math.min(catchUpSpeed, GAME_CONFIG.animal.maxFollowSpeed);
    const nextPosition = moveTowards(
      this.position,
      target,
      speed * deltaSeconds,
    );

    this.setPosition(nextPosition);
  }
}
