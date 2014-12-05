var Laser = (function () {
  function Laser (angle, velX, velZ, playerPos) {
    var geometry = new THREE.BoxGeometry(1.5, 0.5, 0.5);
    var mat = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
      1,
      0.2
    );

    this.mesh = new Physijs.BoxMesh(geometry, mat);
    var x = playerPos.x;
    var z = playerPos.z;
    if (velX >= 0) {
      x += 1.5;
    }
    else {
      x -= 1.5;
    }
    if (velZ >= 0) {
      z += 1.5;
    }
    else {
      z -= 1.5;
    }
    this.mesh.position.set(x, 1, z);
    this.mesh.rotation.y -= angle;
    this.impulseVector = new THREE.Vector3(velX * 10, 0, velZ * 10);
    var _this = this;
    this.mesh.name = "laser";
  }

  return Laser;
})();