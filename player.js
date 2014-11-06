var Player = (function () {
  function Player (parent) {
    var verticesOfCube = [
      -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
      -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
    ];

    var indicesOfFaces = [
      2,1,0,    0,3,2,
      0,4,7,    7,3,0,
      0,1,5,    5,4,0,
      1,2,6,    6,5,1,
      2,3,7,    7,6,2,
      4,5,6,    6,7,4
    ];

    var geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 1, 1 );
    var mat = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    this.mesh = new THREE.Mesh(geometry, mat);
    this.mesh.position.z = -parent.position.y + 1;
    this.mesh.rotation.x = Math.PI * 0.5;
    parent.add(this.mesh);
  }

  return Player;
})();