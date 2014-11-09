var Player = (function () {
  function Player (parent) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);

    var mat = Physijs.createMaterial(
      new THREE.MeshPhongMaterial({ color: 0xffff00 }),
      8,
      10
    );
    this.mesh = new Physijs.BoxMesh(geometry, mat);
    this.mesh.position.y = 0.5;
    parent.add(this.mesh);
    var _this = this;
    var zero = new THREE.Vector3(0, 0, 0);
    this.mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
      _this.mesh.setLinearVelocity(zero);
      _this.mesh.setAngularVelocity(zero);
    });
  }

  return Player;
})();