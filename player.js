var Player = (function () {
  function Player (parent) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);

    var mat = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    // this.mesh = new Physijs.BoxMesh(geometry, mat);
    this.mesh = new THREE.Mesh(geometry, mat);
    //this.mesh.position.z = 3;
    parent.add(this.mesh);
  }

  return Player;
})();