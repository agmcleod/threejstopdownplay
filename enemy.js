var Enemy = (function () {
  function Enemy (parent, x, z) {
    var geometry = new THREE.SphereGeometry(1, 32, 32);

    var mat = Physijs.createMaterial(
      new THREE.MeshPhongMaterial({ color: 0xff0000 }),
      0.8,
      0
    );

    this.mesh = new Physijs.BoxMesh(geometry, mat);
    this.mesh.position.set(x, 1, z);
    var zero = new THREE.Vector3(0, 0, 0);
    this.dir = new THREE.Vector3(
      !!~~(Math.random() * 2) ? 5 : -5,
      0,
      !!~~(Math.random() * 2) ? 5 : -5
    )
    parent.add(this.mesh);
    this.mesh.name = "enemy";

    var _this = this;
    this.mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
      var xRand = !!~~(Math.random() * 2);
      var zRand = !!~~(Math.random() * 2);
      _this.dir.x *= xRand ? 1 : -1;
      _this.dir.z *= zRand ? 1 : -1;
      if (other_object.name === "laser") {
        scene.removeEnemy(_this);
        scene.removeObject(other_object);
      }
    });
  }

  Enemy.prototype.update = function () {
    this.mesh.setLinearVelocity(this.dir);
  }

  return Enemy;
})();