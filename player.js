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

    // var geometry = new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, 1, 1 );

    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 1)
    );

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

    geometry.computeBoundingSphere();

    var mat = Physijs.createMaterial(new THREE.MeshPhongMaterial({ color: 0xffff00 }));
    this.mesh = new Physijs.BoxMesh(geometry, mat);
    this.mesh.position.z = 3;
    this.mesh.rotation.x = Math.PI * 0.5;
    var v = new THREE.Vector3(0, 0, 0);
    this.mesh.setAngularFactor(v);
    this.mesh.setAngularVelocity(v);
    parent.add(this.mesh);
  }

  return Player;
})();