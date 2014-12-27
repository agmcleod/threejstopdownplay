var Laser = (function () {
  function Laser (scene, angle, velX, velZ, playerPos) {
    this.mesh = CreateVariableBox(scene, 1.5, 0.5, 0.5);
    var mat = new BABYLON.StandardMaterial("laserMat", scene);
    mat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    this.mesh.material = mat;
    var x = playerPos.x;
    var z = playerPos.z;
    if (velX >= 0) {
      x += 1;
    }
    else {
      x -= 1;
    }
    if (velZ >= 0) {
      z += 1;
    }
    else {
      z -= 1;
    }
    this.mesh.position.copyFromFloats(x, 1, z);
    this.mesh.rotation.y -= angle;
    this.impulseVector = new BABYLON.Vector3(velX / 2, 0, velZ / 2);
    this.mesh.collisionsEnabled = true;
    this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    this.time = Date.now();
  }

  Laser.prototype.update = function () {
    this.mesh.moveWithCollisions(this.impulseVector);
    if (Date.now() - this.time > 2000) {
      scene.removeLaser(this);
    }
  }

  return Laser;
})();