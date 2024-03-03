export abstract class GameObject {
  abstract isCollidingWith(other: GameObject): boolean;

  abstract handleCollision(other: GameObject): void;
}
