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
    if (window.location.hash.indexOf('debug') !== -1) {
      this.velVector = new BABYLON.Vector3(0.2, 0, 0.2);
    }
    else {
      this.velVector = new BABYLON.Vector3(0, 0, 0);
    }
    this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5);
    this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 1.0, 0);
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
    if (scene.debugCam) {
      this.mesh.moveWithCollisions(this.velVector);
      this.mesh.position.y = 0.5;
    }
    else {
      if (scene.mouseControls.isDown) {
        var coords = scene.mouseControls.touches[0];
        var pickResult = window.scene.scene.pick(coords.x, coords.y);
        var p1, p2;
        if (pickResult.hit) {
          p2 = pickResult.pickedPoint;
        }
        if (!scene.isMobile) {
          p1 = this.mesh.position;
        }

        if (!p1 || !p2) {
          return;
        }

        var angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
        if (scene.isMobile) {
          var velX = Math.cos(angle) / 4;
          var velZ = Math.sin(angle) / 4;
          this.velVector.copyFromFloats(velX, 0, velZ);
          this.mesh.moveWithCollisions(this.velVector);
          this.mesh.position.y = 0.5;
        }

        if ((scene.mouseControls.touches[1].down || !scene.isMobile) && Date.now() - this.lastLaserTime > 200) {
          this.lastLaserTime = Date.now();
          scene.addLaser(new Laser(this.parent, angle, Math.cos(angle), Math.sin(angle), this.mesh.position));
        }
      }

      // check for key controls
      if (!scene.isMobile) {
        var xVel = 0, zVel = 0;
        if (scene.keyControls.isPressed("W")) {
          zVel += 0.25;
        }
        if (scene.keyControls.isPressed("S")) {
          zVel -= 0.25;
        }
        if (scene.keyControls.isPressed("A")) {
          xVel -= 0.25;
        }
        if (scene.keyControls.isPressed("D")) {
          xVel += 0.25;
        }

        this.velVector.copyFromFloats(xVel, 0, zVel);
        this.mesh.moveWithCollisions(this.velVector);
        this.mesh.position.y = 0.5;
      }
    }
  }

  return Player;
})();