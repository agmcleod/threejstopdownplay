var Wave = (function () {
  function Wave(scene, enemyCount, cubeArray) {
    this.enemies = [];
    this.scene = scene;
    for (var i = 0; i < enemyCount; i++) {
      this.addEnemy(cubeArray);
    }
  }

  Wave.prototype.addEnemy = function (cubeArray) {
    var attempts = 0;

    var validCoords = false;

    var x, z;

    while (!validCoords) {
      var validCoords = true;

      x = GameScene.getRandomCoordinate();
      z = GameScene.getRandomCoordinate();

      for (var i = cubeArray.length - 1; i >= 0; i--) {
        var cube = cubeArray[i];
        var diff = (1 + cube.size * 0.2);
        if (Math.abs(x - cube.x) < diff || Math.abs(z - cube.z) < diff) {
          validCoords = false;
          break;
        }
      }

      attempts++;

      if (attempts > 60) {
        return;
      }
    }
    this.enemies.push(new Enemy(this.scene.scene, x, z));
  }

  Wave.prototype.removeEnemy = function(enemy) {
    enemy.mesh.dispose()
    this.enemies.splice(this.enemies.indexOf(enemy), 1);
  }

  Wave.prototype.removeObjects = function () {
    // body...
  }

  return Wave;
})();