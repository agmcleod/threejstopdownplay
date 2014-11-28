var Enemy = (function () {
  function Enemy (parent, x, z) {
    var geometry = new THREE.SphereGeometry(1, 32, 32);

    var mat = Physijs.createMaterial(
      new THREE.MeshPhongMaterial({ color: 0xff0000 }),
      8,
      10
    );

    this.mesh = new Physijs.BoxMesh(geometry, mat);
    this.mesh.position.set(x, 1, z);
    var zero = new THREE.Vector3(0, 0, 0);
    this.mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
      _this.mesh.setLinearVelocity(zero);
      _this.mesh.setAngularVelocity(zero);
    });
    parent.add(this.mesh);
  }

  return Enemy;
})();