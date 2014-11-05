var Player = (function () {
  function Player (parent) {
    var geo = new THREE.BoxGeometry(1, 2, 1);
    var material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
    this.mesh = new THREE.Mesh(geo, material);
    this.mesh.position.z = -parent.position.y + 1;
    this.mesh.rotation.x = Math.PI * 0.5;
    parent.add(this.mesh);
  }

  return Player;
})();