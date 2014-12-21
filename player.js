var Player = (function () {
  var notMovingVector = new BABYLON.Vector3(0, 0, 0);
  var target = new BABYLON.Vector3(0, 0, 0);
  var target2 = new BABYLON.Vector3(0, 0, 0);

  function Player (parent) {
    this.mesh = new BABYLON.Mesh.CreateBox("player", 1, parent);
    var mat = new BABYLON.StandardMaterial("playerMat", parent);
    mat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    mat.emissiveColor = new BABYLON.Color3(0.7, 0.7, 0);
    this.mesh.material = mat;
    this.mesh.position.y = 0.5;

    this.colours = {
      4: [1, 0.7],
      3: [1, 0.4],
      2: [1, 0.2],
      1: [0.8, 0],
      0: [0.6, 0]
    };
    this.parent = parent;

    this.mesh.checkCollisions = true;

    var _this = this;
    var zero = new BABYLON.Vector3(0, 0, 0);
    this.health = 5;
    this.velVector = new BABYLON.Vector3();
    this.lastLaserTime = 0;
  }

  Player.prototype.takeHit = function () {
    if (this.health > 0) {
      this.health--;
      this.mesh.material.diffuseColor.r = this.colours[this.health][0];
      this.mesh.material.diffuseColor.g = this.colours[this.health][1];
    }
    else {
      scene.removeEvents();
      scene.showEndScreen();
    }
  }

  Player.prototype.update = function () {
    if (scene.mouseControls.isDown && !scene.debugCam) {
      var coords = scene.mouseControls.touches[0];
      var pickResult = window.scene.scene.pick(coords.x, coords.y);
      var p1, p2;
      if (pickResult.hit) {
        p2 = pickResult.pickedPoint;
      }
      if (!scene.isMobile) {
        p1 = this.mesh.position;
      }
      else {
        var c2 = scene.mouseControls.moveOrigin;
        var pickedPoint2 = window.scene.scene.pick(c2.x, c2.y);
        if (pickedPoint2.hit) {
          p1 = pickedPoint2.pickedPoint;
        }
      }

      if (!p1 || !p2) {
        return;
      }

      var angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
      var velX = Math.cos(angle) / 4;
      var velZ = Math.sin(angle) / 4;
      this.velVector.copyFromFloats(velX, 0, velZ);
      this.mesh.moveWithCollisions(this.velVector);

      if ((scene.mouseControls.touches[1].down || scene.keyControls.isPressed("SPACE")) && scene.timestamp - this.lastLaserTime > 200) {
        this.lastLaserTime = scene.timestamp;
        scene.addLaser(new Laser(this.parent, angle, Math.cos(angle), Math.sin(angle), this.mesh.position));
      }
    }
  }

  return Player;
})();