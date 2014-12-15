function CreateVariableBox (x, y, z) {
  var normalsSource = [
    new BABYLON.Vector3(0, 0, 1),
    new BABYLON.Vector3(0, 0, -1),
    new BABYLON.Vector3(1, 0, 0),
    new BABYLON.Vector3(-1, 0, 0),
    new BABYLON.Vector3(0, 1, 0),
    new BABYLON.Vector3(0, -1, 0)
  ];

  var indices = [];
  var positions = [];
  var normals = [];
  var uvs = [];

  for (var index = 0; index < normalsSource.length; index++) {
    var normal = normalsSource[index];

    // Get two vectors perpendicular to the face normal and to each other.
    var side1 = new BABYLON.Vector3(normal.y, normal.z, normal.x);
    var side2 = BABYLON.Vector3.Cross(normal, side1);

    // Six indices (two triangles) per face.
    var verticesLength = positions.length / 3;
    indices.push(verticesLength);
    indices.push(verticesLength + 1);
    indices.push(verticesLength + 2);

    indices.push(verticesLength);
    indices.push(verticesLength + 2);
    indices.push(verticesLength + 3);

    var size;

    if (normal.x !== 0) {
      size = x;
    }

    if (normal.y !== 0) {
      size = y;
    }

    if (normal.z !== 0) {
      size = z;
    }

    // Four vertices per face.
    var vertex = normal.subtract(side1).subtract(side2).scale(size / 2);
    positions.push(vertex.x, vertex.y, vertex.z);
    normals.push(normal.x, normal.y, normal.z);
    uvs.push(1.0, 1.0);

    vertex = normal.subtract(side1).add(side2).scale(size / 2);
    positions.push(vertex.x, vertex.y, vertex.z);
    normals.push(normal.x, normal.y, normal.z);
    uvs.push(0.0, 1.0);

    vertex = normal.add(side1).add(side2).scale(size / 2);
    positions.push(vertex.x, vertex.y, vertex.z);
    normals.push(normal.x, normal.y, normal.z);
    uvs.push(0.0, 0.0);

    vertex = normal.add(side1).subtract(side2).scale(size / 2);
    positions.push(vertex.x, vertex.y, vertex.z);
    normals.push(normal.x, normal.y, normal.z);
    uvs.push(1.0, 0.0);
  }

  // Result
  var vertexData = new BABYLON.VertexData();

  vertexData.indices = indices;
  vertexData.positions = positions;
  vertexData.normals = normals;
  vertexData.uvs = uvs;

  return vertexData;
}