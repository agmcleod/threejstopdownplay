var Player = (function () {
  var notMovingVector = new BABYLON.Vector3(0, 0, 0);
  var target = new BABYLON.Vector3(0, 0, 0);
  var target2 = new BABYLON.Vector3(0, 0, 0);

  function Player (parent) {
    this.mesh = new BABYLON.Mesh.CreateBox("player", 1, parent);
    var mat = new BABYLON.StandardMaterial("playerMat", parent);
    mat.diffuseColor = new BABYLON.Color3(1, 1, 0);
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

    this.mesh.collisionsEnabled = true;

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
    if (scene.mouseControls.isDown && (scene.mouseControls.touches[1].down || scene.keyControls.isPressed("SPACE")) && scene.timestamp - this.lastLaserTime > 200) {
      this.lastLaserTime = scene.timestamp;
      scene.addLaser(new Laser(this.parent, angle, Math.cos(angle), Math.sin(angle), this.mesh.position));
    }
  }

  return Player;
})();