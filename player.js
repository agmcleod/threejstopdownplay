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
  }

  return Player;
})();