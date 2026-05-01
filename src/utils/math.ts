import type { PointData } from 'pixi.js';

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

export function distanceBetween(first: PointData, second: PointData): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

export function moveTowards(current: PointData, target: PointData, maxDistance: number): PointData {
  const distance = distanceBetween(current, target);

  if (distance <= maxDistance || distance === 0) {
    return {
      x: target.x,
      y: target.y,
    };
  }

  const ratio = maxDistance / distance;

  return {
    x: current.x + (target.x - current.x) * ratio,
    y: current.y + (target.y - current.y) * ratio,
  };
}
