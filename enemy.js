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
    parent.add(this.mesh);
    this.mesh.name = "enemy";
  }

  return Enemy;
})();