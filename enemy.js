var Enemy = (function () {
  var VEL = 10;
  function Enemy (parent, x, z) {
    this.mesh = BABYLON.Mesh.CreateSphere("sphere", 32, 32, parent);
    this.mesh.position.copyFromFloats(x, 1, z);
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