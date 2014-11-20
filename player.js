var Player = (function () {
  var notMovingVector = new THREE.Vector3(0, 0, 0);
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

  Player.prototype.update = function () {
    if (scene.mouseControls.isDown) {
      var coords = scene.mouseControls.screenCoords;
      var vector = new THREE.Vector3();

      vector.set(
        ( scene.mouseControls.screenCoords.x / window.innerWidth ) * 2 - 1,
        - ( scene.mouseControls.screenCoords.y / window.innerHeight ) * 2 + 1,
        0.5
      );
      vector.unproject(scene.camera);

      var dir = vector.sub(scene.camera.position).normalize();
      var distance = - scene.camera.position.y / dir.y;

      var p1 = this.mesh.position;
      var p2 = scene.camera.position.clone().add(dir.multiplyScalar(distance));

      console.log(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);

      var angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
      var velX = Math.cos(angle) * 20;
      var velZ = Math.sin(angle) * 20;

      this.mesh.setLinearVelocity(new THREE.Vector3(velX, 0, velZ));
    }
    else {
      this.mesh.setLinearVelocity(notMovingVector);
    }
  }

  return Player;
})();