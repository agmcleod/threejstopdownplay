var Enemy = (function () {
  function Enemy (gameScene, x, z) {
    this.mesh = BABYLON.Mesh.CreateSphere("sphere", 20, 1, gameScene.scene);
    var material = new BABYLON.StandardMaterial("enemyMat", gameScene.scene);
    material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    this.mesh.material = material;
    this.mesh.position.copyFromFloats(x, 0.5, z);
    var zero = new BABYLON.Vector3(0, 0, 0);

    this.name = "enemy";

    this.dir = new BABYLON.Vector3(
      0,0,0
    );
    this.mesh.collisionsEnabled = true;
    this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
    this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);
  }

  Enemy.prototype.update = function (player) {
    var playerPos = player.mesh.position;
    var pos = this.mesh.position;
    var angle = Math.atan2(playerPos.z - pos.z, playerPos.x - pos.x);
    this.dir.x = Math.cos(angle) / 8;
    this.dir.z = Math.sin(angle) / 8;
    var value;
    this.mesh.moveWithCollisions(this.dir);
    if (this.mesh.intersectsMesh(player.collisionBounds, false)) {
      value = player.takeHit();
    }
    this.mesh.position.y = 0.5;
    return value;
  }

  return Enemy;
})();