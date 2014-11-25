var Laser = (function () {
  function Laser (angle, velX, velZ, playerPos) {
    var geometry = new THREE.BoxGeometry(1.5, 0.5, 0.5);
    var mat = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

    this.mesh = new THREE.Mesh(geometry, mat);
    this.mesh.position.set(playerPos.x, playerPos.y, playerPos.z);
    this.mesh.rotation.y -= angle;
    this.velX = velX;
    this.velZ = velZ;
  }

  Laser.prototype.update = function () {
    this.mesh.position.x += this.velX;
    this.mesh.position.z += this.velZ;
  }

  return Laser;
})();