var Enemy = (function () {
  var VEL = 10;
  function Enemy (gameScene, x, z) {
    this.mesh = BABYLON.Mesh.CreateSphere("sphere", 20, 1, gameScene.scene);
    var material = new BABYLON.StandardMaterial("enemyMat", gameScene.scene);
    material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    this.mesh.material = material;
    this.mesh.position.copyFromFloats(x, 0.5, z);
    var zero = new BABYLON.Vector3(0, 0, 0);
    var xVel, zVel;
    var r = ~~(Math.random() * 3);
    if (r < 1) {
      xVel = VEL;
    }
    else if (r < 2) {
      xVel = -VEL;
    }
    else {
      xVel = 0;
    }
    r = ~~(Math.random() * 3);

    if (r < 1) {
      zVel = VEL;
    }
    else if (r < 2) {
      zVel = -VEL;
    }
    else {
      zVel = 0;
    }

    this.dir = new BABYLON.Vector3(
      xVel,
      0,
      zVel
    );
    this.mesh.collisionsEnabled = true;
    this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
    this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);
  }

  Enemy.prototype.changeDirection = function () {
    var xRand = !!~~(Math.random() * 2);
    var zRand = !!~~(Math.random() * 2);
    this.dir.x *= xRand ? 1 : -1;
    this.dir.z *= zRand ? 1 : -1;
  }

  Enemy.prototype.update = function () {
    this.mesh.moveWithCollisions(this.dir);
  }

  return Enemy;
})();