var Player = (function () {
  function Player (parent) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);

    var mat = Physijs.createMaterial(
      new THREE.MeshPhongMaterial({ color: 0xffff00 }),
      0.8,
      0
    );
    this.mesh = new Physijs.BoxMesh(geometry, mat);
    this.mesh.position.y = 0.5;
    this.mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
    parent.add(this.mesh);
  }

  return Player;
})();