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

      var dir = vector.sub(this.mesh.position);
      var xabs = Math.abs(dir.x);
      var zabs = Math.abs(dir.z);
      var xVel, zVel;
      if (xabs > zabs) {
        var ratio = zabs / xabs;
        xVel = (dir.x >= 0 ? 1 : -1);
        zVel = ratio * (dir.z >= 0 ? 1 : -1);
      }
      else if (zabs > xabs) {
        var ratio = xabs / zabs;
        xVel = ratio * (dir.x >= 0 ? 1 : -1);
        zVel = (dir.z >= 0 ? 1 : -1);
      }
      else {
        xVel = (dir.x >= 0 ? 1 : -1);
        zVel = (dir.z >= 0 ? 1 : -1);
      }
      xVel *= 50;
      zVel *= 50;

      this.mesh.setLinearVelocity(new THREE.Vector3(xVel, 0, zVel));
      this.mesh.__dirtyPosition = true;
    }
    else {
      this.mesh.setLinearVelocity(notMovingVector);
    }
  }

  return Player;
})();