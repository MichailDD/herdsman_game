import { Container } from 'pixi.js';
import type { PointData } from 'pixi.js';

export class Entity {
  public readonly view: Container;

  public constructor() {
    this.view = new Container();
  }

  public setPosition(position: PointData): void {
    this.view.position.set(position.x, position.y);
  }

  public get position(): PointData {
    return {
      x: this.view.x,
      y: this.view.y,
    };
  }
}
