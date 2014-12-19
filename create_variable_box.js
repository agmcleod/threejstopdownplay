function CreateVariableBox (scene, x, y, z) {
  var mesh = new BABYLON.Mesh.CreateBox("box", 1, scene);
  mesh.scaling.x = x;
  mesh.scaling.y = y;
  mesh.scaling.z = z;
  return mesh;
}