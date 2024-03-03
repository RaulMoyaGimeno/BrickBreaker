import { GameObject } from "./gameObject";

export class CollisionManager {
  checkCollisions(gameObjects: GameObject[]): void {
    for (let i = 0; i < gameObjects.length; i++) {
      for (let j = i + 1; j < gameObjects.length; j++) {
        if (gameObjects[i].isCollidingWith(gameObjects[j])) {
          gameObjects[i].handleCollision(gameObjects[j]);
          gameObjects[j].handleCollision(gameObjects[i]);
        }
      }
    }
  }
}
