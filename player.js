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
    this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 0.5, 0.5);
    this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);
    this.collisionBounds = new BABYLON.Mesh.CreateBox("playerCollision", 1.1, parent);
    var colMat = new BABYLON.StandardMaterial("collisionMat", parent);
    colMat.alpha = 0;
    this.collisionBounds.material = colMat;
    this.collisionBounds.parent = this.mesh;
    this.lastLaserTime = 0;
    this.damageTime = 0;
  }

  Player.prototype.resetHealth = function () {
    this.health = 5;
    this.mesh.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.mesh.material.emissiveColor = new BABYLON.Color3(0.7, 0.7, 0);
  }

  Player.prototype.takeHit = function () {
    if (this.health > 0) {
      if (Date.now() - this.damageTime > 500) {
        this.damageTime = Date.now();
        this.health--;
        this.mesh.material.emissiveColor.r = this.colours[this.health][0];
        this.mesh.material.emissiveColor.g = this.colours[this.health][1];
      }
      return false;
    }
    else {
      return true;
    }
  }

  Player.prototype.update = function () {
    var delta = BABYLON.Tools.GetDeltaTime();
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

      var angle;
      if (scene.isMobile && scene.mouseControls.touches[0].moving) {
        angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
        var velX = Math.cos(angle) / 70;
        var velZ = Math.sin(angle) / 70;
        this.velVector.copyFromFloats(velX * delta, 0, velZ * delta);
        this.mesh.moveWithCollisions(this.velVector);
        this.mesh.position.y = 0.5;
      }
      else {
        angle = Math.atan2(p2.z - p1.z, p2.x - p1.x);
      }

      if ((scene.mouseControls.touches[1].down || !scene.isMobile) && Date.now() - this.lastLaserTime > 200) {
        this.lastLaserTime = Date.now();
        var laserAngle;
        // for touch controls, target closest enemy
        if (scene.mouseControls.touches[1].down) {
          var targetPos = new BABYLON.Vector3(Infinity, 0, Infinity);
          var playerPos = this.mesh.position;
          for (var i = scene.wave.enemies.length - 1; i >= 0; i--) {
            var enemyPos = scene.wave.enemies[i].mesh.position;
            if (Math.abs(enemyPos.x) - Math.abs(playerPos.x) <= Math.abs(targetPos.x) - Math.abs(playerPos.x) && Math.abs(enemyPos.z) - Math.abs(playerPos.z) <= Math.abs(targetPos.z) - Math.abs(playerPos.z)) {
              targetPos.x = enemyPos.x;
              targetPos.z = enemyPos.z;
            }
          }
          laserAngle = Math.atan2(targetPos.z - playerPos.z, targetPos.x - playerPos.x);
        }
        else {
          laserAngle = angle;
        }
        scene.addLaser(new Laser(this.parent, laserAngle, Math.cos(laserAngle), Math.sin(laserAngle), this.mesh.position));
      }
    }

    // check for key controls
    if (!scene.isMobile) {
      var xVel = 0, zVel = 0;
      if (scene.keyControls.isPressed("W")) {
        zVel += 0.01;
      }
      if (scene.keyControls.isPressed("S")) {
        zVel -= 0.01;
      }
      if (scene.keyControls.isPressed("A")) {
        xVel -= 0.01;
      }
      if (scene.keyControls.isPressed("D")) {
        xVel += 0.01;
      }

      this.velVector.copyFromFloats(xVel * delta, 0, zVel * delta);
      this.mesh.moveWithCollisions(this.velVector);
      this.mesh.position.y = 0.5;
    }
  }

  return Player;
})();