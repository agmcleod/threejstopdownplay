var Player = (function () {
  var notMovingVector = new THREE.Vector3(0, 0, 0);
  var target = new THREE.Vector3(0, 0, 0);
  var target2 = new THREE.Vector3(0, 0, 0);

  function Player (parent) {
    var geometry = new THREE.BoxGeometry(1, 1, 1);

    this.mat = Physijs.createMaterial(
      new THREE.MeshPhongMaterial({ color: 0xffff00 }),
      8,
      10
    );

    var colours = {
      4: [1, 0.7],
      3: [1, 0.4],
      2: [1, 0.2],
      1: [0.8, 0]
    };

    this.mesh = new Physijs.BoxMesh(geometry, this.mat);
    this.mesh.position.y = 0.5;
    parent.add(this.mesh);
    var _this = this;
    var zero = new THREE.Vector3(0, 0, 0);
    this.health = 5;
    this.mesh.addEventListener('collision', function (other_object, relative_velocity, relative_rotation, contact_normal) {
      _this.mesh.setLinearVelocity(zero);
      _this.mesh.setAngularVelocity(zero);

      if (other_object.name === "enemy") {
        if (_this.health > 0) {
          _this.health--;
          _this.mat.color.r = colours[_this.health][0];
          _this.mat.color.g = colours[_this.health][1];
        }
      }
    });
    this.lastLaserTime = 0;
  }

  Player.prototype.update = function () {
    if (scene.mouseControls.isDown) {
      var coords = scene.mouseControls.touches[0];
      var p2 = scene.mouseControls.coordsAsVector(coords.x, coords.y, scene.camera, target);
      var p1;
      if (!scene.isMobile) {
        p1 = this.mesh.position;
      }
      else {
        var c2 = scene.mouseControls.moveOrigin;
        p1 = scene.mouseControls.coordsAsVector(c2.x, c2.y, scene.camera, target2);
      }

      var angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
      var velX = Math.cos(angle) * 20;
      var velZ = Math.sin(angle) * 20;
      this.mesh.setLinearVelocity(new THREE.Vector3(velX, 0, velZ));

      if ((scene.mouseControls.touches[1].down || scene.keyControls.isPressed("SPACE")) && scene.timestamp - this.lastLaserTime > 200) {
        this.lastLaserTime = scene.timestamp;
        scene.addLaser(new Laser(angle, Math.cos(angle), Math.sin(angle), this.mesh.position));
      }
    }
    else {
      notMovingVector.y = this.mesh.getLinearVelocity().y;
      this.mesh.setLinearVelocity(notMovingVector);
    }
  }

  return Player;
})();