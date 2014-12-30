var Laser = (function () {
  function Laser (scene, angle, velX, velZ, playerPos) {
    this.mesh = CreateVariableBox(scene, 1.5, 0.5, 0.5);
    var mat = new BABYLON.StandardMaterial("laserMat", scene);
    mat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    this.mesh.material = mat;
    var x = playerPos.x + velX;
    var z = playerPos.z + velZ;
    this.mesh.position.copyFromFloats(x, 1, z);
    this.mesh.rotation.y -= angle;
    this.impulseVector = new BABYLON.Vector3(velX / 2, 0, velZ / 2);
    this.mesh.collisionsEnabled = true;
    this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    this.time = Date.now();
  }

  Laser.prototype.update = function () {
    this.mesh.position.x += this.impulseVector.x;
    this.mesh.position.z += this.impulseVector.z;
    if (Date.now() - this.time > 2000) {
      scene.removeLaser(this);
    }
  }

  return Laser;
})();